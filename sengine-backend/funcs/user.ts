import { NextFunction, Response } from "express";

import async from "async";

import crypto from "crypto";
import * as AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import initLogger from "../config/logger";
// import s3 from '../core/s3';
import User from "../models/user";
import { IUser, NewRequest as Request } from "../config/types";
import util from "../models/util";

const logger = initLogger("ControllerUser");
const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });

const SES = new AWS.SES();

const s3 = new AWS.S3();
const s3Bucket = process.env.BUCKET_NAME;
export default class UserController {
  async utilSignup(req: Request, res: Response) {
    async
      .waterfall([
        function (done) {
          User.create({
            email: req.body.email.trim(),
            password: req.body.password.trim(),
            username: req.body.username.trim().toLowerCase(),
          })
            .then((user) => done(null, user))
            .catch((e) => done(e, null));
        },
        function (user, done) {
          // create the random token
          crypto.randomBytes(20, (err, buffer) => {
            const token = buffer.toString("hex");
            done(err, user, token);
          });
        },
        function (user, token, done) {
          User.findByIdAndUpdate(
            { _id: user._id },
            {
              currUsrOp: "R",
              currSecToken: token,
              secTokExp: new Date(Date.now() + 86400000),
            },
            { new: true }
          )
            .orFail(new Error("User not found!"))
            .exec((err, newUser) => {
              done(err, token, newUser);
            });
        },
        function (token, user, done) {
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
          });
        },
      ])
      .promise()
      .then(() =>
        res
          .status(201)
          .json({ success: true, message: "Successfully signed up." })
      )
      .catch((err) => {
        if (err) {
          logger.error(`Error when saving a user: ${err}`);
          return res.status(400).json({ success: false, message: err.message });
        }
      });
  }

  async utilLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    User.findOne({
      email,
    })
      .select("+password")
      .orFail(new Error("User not found!"))
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

  async getLikedutils(req: Request, res: Response) {
    const { username } = req.user;
    try {
      const usr = await User.findOne({ username })
        .orFail(new Error("User not found!"))
        .populate([{ path: "likes", model: "util" }]);

      return res.status(200).json({ success: true, message: usr.likes });
    } catch (error) {
      logger.error(
        `Error getting user by username: ${username} with error: ${error}`
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserutils(req: Request, res: Response) {
    const { username } = req.params;
    try {
      const usr = await User.findOne({ username })
        .orFail(new Error("User not found!"))
        .populate([{ path: "utils", model: "util" }]);

      return res.status(200).json({ success: true, message: usr.likes });
    } catch (error) {
      logger.error(
        `Error getting user by username: ${username} with error: ${error}`
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateProp(req: Request, res: Response) {
    const { prop } = req.params;
    if (prop === "phone" || prop === "username" || prop === "email") {
      const email = req.body[prop].trim();
      const phone = req.body.phone.trim();

      if (email === req.user.email)
        return res
          .status(400)
          .json({ success: true, message: `${prop} is the same as requested` });
      return User.findById(req.user._id)
        .then(async (u) => {
          if (prop === "email") {
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
            .update({ email }, { runValidators: true })
            .orFail(new Error("User not found!"))
            .exec()
            .then(() =>
              res.status(200).json({
                success: true,
                message: `Successfully updated ${prop}`,
              })
            )
            .catch((error) => {
              if (error.codeName === "DuplicateKey")
                return res
                  .status(400)
                  .json({ success: false, message: `${prop} already exists` });
              if (error.message.includes("Validation"))
                return res
                  .status(400)
                  .json({ success: false, message: error.message });
              logger.error(
                `Error updating ${prop} to ${email} for user ${req.user._id} with error ${error}`
              );
              return res.status(500).json({ success: false, message: error });
            })
        );
    } else {
      return res.status(400).json({
        success: false,
        message: "property to update must be a phone, email or username.",
      });
    }
  }

  async checkToken(req: Request, res: Response) {
    const nd = new Date();
    User.findOne({
      currSecToken: req.params.token,
      secTokExp: { $gt: nd },
    })
      .orFail(new Error("User not found!"))
      .exec()
      .then(() =>
        res.status(200).json({
          success: true,
          message: "Valid reset token",
          token: req.params.token,
        })
      )
      .catch(() =>
        res.status(400).json({
          success: false,
          message: "Token is invalid or has expired.",
        })
      );
  }

  async utilResetPassword(req: Request, res: Response) {
    async.waterfall(
      [
        function (done) {
          User.findOne({
            email: req.body.email,
          })
            .orFail(new Error("User not found!"))
            .exec((err, user) => {
              if (user) {
                done(err, user);
              } else {
                done("User not found.");
              }
            });
        },
        function (user, done) {
          // create the random token
          crypto.randomBytes(20, (err, buffer) => {
            const token = buffer.toString("hex");
            done(err, user, token);
          });
        },
        function (user, token, done) {
          User.findByIdAndUpdate(
            { _id: user._id },
            {
              currUsrOp: "R",
              currSecToken: token,
              secTokExp: new Date(Date.now() + 86400000),
            },
            { new: true }
          )
            .orFail(new Error("User not found!"))
            .exec((err, newUser) => {
              done(err, token, newUser);
            });
        },
        function (token, user, done) {
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
          })
            .promise()
            .then(() =>
              res
                .status(200)
                .json({ success: true, message: "Sent password reset email" })
            )
            .catch((err) => done(err));
        },
      ],
      (err) => res.status(500).json({ success: false, message: err })
    );
  }

  async utilPasswordReset(req: Request, res: Response) {
    const nd = new Date();
    User.findOneAndUpdate(
      {
        currSecToken: req.params.token,
        currUsrOp: "R",
        secTokExp: { $gt: nd },
      },
      {
        password: req.body.password,
        currSecToken: undefined,
        currUsrOp: undefined,
        secTokExp: undefined,
      }
    )
      .orFail(new Error("User not found!"))
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
        if (err) {
          if (err.name.includes("ValidationError"))
            return res
              .status(400)
              .json({ success: false, message: err.message });
          logger.error(`Error resetting password with error ${err} `);
          return res.status(500).json({ success: false, message: err });
        }
      });
  }
  async utilAcctDelete(req: Request, res: Response) {
    async.waterfall(
      [
        function (done) {
          User.findOne({
            email: req.body.email,
          })
            .orFail(new Error("User not found!"))
            .exec((err, user) => {
              if (user) {
                done(err, user);
              } else {
                done("User not found.");
              }
            });
        },
        function (user, done) {
          // create the random token
          crypto.randomBytes(20, (err, buffer) => {
            const token = buffer.toString("hex");
            done(err, user, token);
          });
        },
        function (user, token, done) {
          User.findByIdAndUpdate(
            { _id: user._id },
            {
              currUsrOp: "D",
              currSecToken: token,
              secTokExp: new Date(Date.now() + 86400000),
            },
            { new: true }
          )
            .orFail(new Error("User not found!"))
            .exec((err, newUser) => {
              done(err, token, newUser);
            });
        },
        function (token, user, done) {
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
            .promise()
            .then(() =>
              res
                .status(200)
                .json({ success: true, message: "Sent deletion email" })
            )
            .catch((err) => done(err));
        },
      ],
      (err) => res.status(500).json({ success: false, message: err })
    );
  }

  async utilDeleteAcct(req: Request, res: Response) {
    const nd = new Date();
    User.findOneAndRemove({
      currSecToken: req.params.token,
      currUsrOp: "D",
      secTokExp: { $gt: nd },
    })
      .orFail(new Error("User not found!"))
      .then((u) => {
        if (!u) {
          return res.status(400).json({
            success: false,
            message: "Deletion token is invalid or has expired.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Account terminated. Adios amigo...",
          });
        }
      })
      .catch((err) => {
        if (err) {
          if (err.name.includes("ValidationError"))
            return res
              .status(400)
              .json({ success: false, message: err.message });
          logger.error(`Error resetting password with error ${err} `);
          return res.status(500).json({ success: false, message: err });
        }
      });
  }
}
