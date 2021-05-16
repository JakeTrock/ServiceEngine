import { NextFunction, Response } from "express";

import crypto from "crypto";
import * as AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import initLogger from "../config/logger";
// import s3 from '../core/s3';
import User from "../models/user";
import utilSchema from "../models/util";

const logger = initLogger("ControllerUser");
const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });

const SES = new AWS.SES();

const s3 = new AWS.S3();
const s3Bucket = process.env.BUCKET_NAME;

const hash = (pass, isPwd) => {
  const pwd = pass.trim();
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      logger.error(`Error while generating salt with bcrypt: ${err}`);
      return err.message;
    } else if (
      (isPwd && pwd.match(/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]*$/)) ||
      pwd.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    ) {
      return bcrypt.hash(pwd, salt, (err1: Error, hash) => {
        if (err1) {
          logger.error(`Error while hashing with bcrypt: ${err1}`);
          return err1.message;
        }
        return hash;
      });
    } else
      return new Error(
        "Password must contain at least one upper case character, one lower case character, and one number"
      );
  });
};

export default class UserController {
  async Signup(req: Request, res: Response) {
    const { username, email, password, phone } = req.body;
    crypto.randomBytes(20, async (err, buffer) => {
      const token = buffer.toString("hex");
      const pw = await hash(password, true);
      const ph = await hash(phone, false);
      User.create({
        email: email.trim(),
        password: pw,
        phone: ph,
        username: username.trim().toLowerCase(),
        currUsrOp: "R",
        currSecToken: token,
        secTokExp: new Date(Date.now() + 86400000),
      })
        .then((user) =>
          SES.sendEmail({
            Destination: {
              ToAddresses: [user.email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: `To verify your account click the following link or paste it into your browser<br/><br/> https://${req.headers.host}/user/confirm/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Password Reset",
              },
            },
            Source: `Sengine <${process.env.LOGIN_USER}>`,
          }).promise()
        )
        .then(() =>
          res
            .status(201)
            .json({ success: true, message: "Successfully signed up." })
        )
        .catch((err) => {
          if (err) {
            logger.error(`Error when saving a user: ${err}`);
            return res
              .status(400)
              .json({ success: false, message: err.message });
          }
        });
    });
  }

  Login(req: Request, res: Response) {
    const { email, password } = req.body;
    User.findOne({
      email,
    })
      .then((user) =>
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              const { username, _id } = user;
              return jwt.sign(
                {
                  username,
                  email,
                  _id,
                },
                process.env.JWT_SECRET,
                {},
                (err, tk: String) => {
                  if (err)
                    res
                      .status(400)
                      .json({ success: false, message: err.message });
                  res.status(200).json({
                    success: true,
                    message: {
                      token: tk,
                    },
                  });
                }
              );
            }
            return res
              .status(400)
              .json({ success: false, message: "Incorrect password" });
          })
          .catch((err) =>
            res.status(500).json({ success: false, message: err.message })
          )
      )
      .catch((e) =>
        res.status(500).json({ success: false, message: e.message })
      );
  }

  getLikedutils(req: Request, res: Response) {
    const { username } = req.user;
    User.findOne({ username })
      .then((usr) => {
        return res.status(200).json({ success: true, message: usr.likes });
      })
      .catch((e) => {
        logger.error(
          `Error getting user by username: ${username} with error: ${e}`
        );
        return res.status(500).json({ success: false, message: e.message });
      });
  }

  getUserutils(req: Request, res: Response) {
    const { username } = req.params;

    User.findOne({ username })
      .then((usr) => {
        return res.status(200).json({ success: true, message: usr.utils });
      })
      .catch((e) => {
        logger.error(
          `Error getting user by username: ${username} with error: ${e}`
        );
        return res.status(500).json({ success: false, message: e.message });
      });
  }

  updateProp(req: Request, res: Response) {
    const { prop } = req.params;
    const { _id } = req.user;
    if (prop === "phone" || prop === "username" || prop === "email") {
      const prp = req.body[prop].trim();
      return User.findOne(_id)
        .then(async (u) => {
          if (prop === "email") {
            const phone = req.body.phone.trim();
            const bc = await bcrypt.compare(phone, u.phone);
            if (bc) {
              return u;
            } else {
              throw res
                .status(400)
                .json({ success: false, message: `Invalid ${prop}` });
            }
          } else {
            return u;
          }
        })
        .then((u) =>
          u
            .update({ prp })
            .then(() =>
              res.status(200).json({
                success: true,
                message: `Successfully updated ${prop}`,
              })
            )
            .catch((error) => {
              logger.error(
                `Error updating ${prop} to ${prp} for user ${_id} with error ${error}`
              );
              return res
                .status(500)
                .json({ success: false, message: error.message });
            })
        );
    } else {
      return res.status(400).json({
        success: false,
        message: "property to update must be a phone, email or username.",
      });
    }
  }

  checkToken(req: Request, res: Response) {
    const nd = new Date();
    const { token } = req.params;
    User.findOne({
      currSecToken: token,
      secTokExp: { $gte: nd },
    })
      .then(() =>
        res.status(200).json({
          success: true,
          message: "Valid reset token",
          token: token,
        })
      )
      .catch(() =>
        res.status(400).json({
          success: false,
          message: "Token is invalid or has expired.",
        })
      );
  }

  //TODO: make email func
  askResetPassword(req: Request, res: Response) {
    crypto.randomBytes(20, (err, buffer) => {
      const token = buffer.toString("hex");
      User.update(
        {
          currUsrOp: "R",
          currSecToken: token,
          secTokExp: new Date(Date.now() + 86400000),
        },
        {
          returning: true,
          where: {
            email: req.body.email,
          },
        }
      )
        .then((user) =>
          SES.sendEmail({
            Destination: {
              ToAddresses: [user.email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: `To reset your password click the following link or paste it into your browser<br/><br/> https://${req.headers.host}/user/reset/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Password Reset",
              },
            },
            Source: `Sengine <${process.env.LOGIN_USER}>`,
          }).promise()
        )
        .then(() =>
          res
            .status(200)
            .json({ success: true, message: "Sent password reset email" })
        )
        .catch((err) =>
          res.status(500).json({ success: false, message: err.message })
        );
    });
  }

  ResetPassword(req: Request, res: Response) {
    const nd = new Date();
    hash(req.body.password, true)
      .then((hash) =>
        User.update(
          {
            password: hash,
            currSecToken: undefined,
            currUsrOp: undefined,
            secTokExp: undefined,
          },
          {
            returning: true,
            where: {
              currSecToken: req.params.token,
              currUsrOp: "R",
              secTokExp: { $gt: nd },
            },
          }
        )
      )
      .then((u) => {
        if (!u) {
          return res.status(400).json({
            success: false,
            message: "Password reset token is invalid or has expired.",
          });
        } else {
          res
            .status(200)
            .json({ success: true, message: "Password successfully reset" });
        }
      })
      .catch((err) => {
        logger.error(`Error resetting password with error ${err} `);
        return res.status(500).json({ success: false, message: err.message });
      });
  }

  askAcctDelete(req: Request, res: Response) {
    crypto.randomBytes(20, (err, buffer) => {
      const token = buffer.toString("hex");
      User.findByIdAndUpdate(
        {
          currUsrOp: "D",
          currSecToken: token,
          secTokExp: new Date(Date.now() + 86400000),
        },
        {
          returning: true,
          where: {
            email: req.body.email,
          },
        }
      )
        .then((user) =>
          SES.sendEmail({
            Destination: {
              ToAddresses: [user.email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: `To reset your password click the following link or paste it into your browser<br/><br/> https://${req.headers.host}/user/delete/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "Password Reset",
              },
            },
            Source: `Sengine <${process.env.LOGIN_USER}>`,
          })
        )
        .then(() =>
          res
            .status(200)
            .json({ success: true, message: "Sent deletion email" })
        )
        .catch((err) =>
          res.status(500).json({ success: false, message: err.message })
        );
    });
  }

  AcctDelete(req: Request, res: Response) {
    const nd = new Date();
    User.destroy({
      returning: true,
      where: {
        currSecToken: req.params.token,
        currUsrOp: "D",
        secTokExp: { $gt: nd },
      },
    })
      .then((usr) =>
        utilSchema.destroy({
          returning: true,
          where: {
            authorId: usr._id,
          },
        })
      )
      .then((u) => {
        if (!u) {
          return res.status(400).json({
            success: false,
            message: "Deletion token is invalid or has expired.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Removed your account.",
          });
        }
      })
      .catch((err) => {
        logger.error(`Error resetting password with error ${err} `);
        return res.status(500).json({ success: false, message: err.message });
      });
  }
}
