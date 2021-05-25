import { Request, Response } from "express";

import crypto from "crypto";
import * as AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import s3 from '../core/s3';
import User from "../models/user";
import utilSchema from "../models/util";
import { err400, err500, prpcheck } from "../config/helpers";
import UserSchema from "../models/user";
import RequestUsr from "../config/types";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });

const SES = new AWS.SES();

const s3 = new AWS.S3();
const s3Bucket = process.env.BUCKET_NAME;

const sendMessage = (message: string, link: string, recipient: string) =>
  SES.sendEmail({
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `To ${message} click the following link or paste it into your browser<br/><br/> ${link}<br/><br/>If you didn't make this RequestUsr, then ignore the email and you'll be safe<br/>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: message,
      },
    },
    Source: `Sengine <${process.env.LOGIN_USER}>`,
  }).promise();

const hash = (pass: string, isPwd: boolean): Promise<String> =>
  new Promise((resolve, reject) => {
    const pwd = pass.trim();
    return bcrypt.genSalt(10, (err: Error, salt) => {
      if (err) {
        return reject(err);
      } else if (
        (isPwd &&
          pwd.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) ||
        pwd.match(
          /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
        )
      ) {
        return bcrypt.hash(pwd, salt, (err1: Error, hash) => {
          if (err1) {
            return reject(err1);
          }
          return resolve(hash);
        });
      } else
        return reject(
          new Error(
            "Password must be at least 8 characters, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters"
          )
        );
    });
  });

export default class UserController {
  async Signup(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (prpcheck(email) || prpcheck(username) || prpcheck(password))
      return err400(res, "missing properties");

    const token = await crypto.randomBytes(20).toString("hex");
    const pw = await hash(password, true);
    const emtrim = email.trim();
    const unametrim = username.trim().toLowerCase();

    if (emtrim.match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/))
      return err400(res, "The email you provided was not correctly typed");

    if (
      unametrim.length > 20 ||
      unametrim.length < 2 ||
      unametrim.match(/^[a-zA-Z0-9_.]*$/)
    )
      return err400(
        res,
        "Username is improperly formatted(must be >2 and <20 characters in length, only characters a-z,0-9,period and underscore)"
      );

    const createParams = {
      email: emtrim,
      password: pw,
      username: unametrim,
      currUsrOp: "C",
      currSecToken: token,
      secTokExp: new Date(Date.now() + 86400000),
    };
    return User.create(createParams)
      .then(() =>
        sendMessage(
          "verify your account",
          `https://${process.env.HOST}/user/confirm/${token}`,
          emtrim
        )
      )
      .then(() =>
        res
          .status(200)
          .json({ success: true, message: "Successfully signed up." })
      )
      .catch((err) => err500(res, err, "Internal server error saving a user"));
  }

  Confirm(req: Request, res: Response) {
    const nd = new Date();
    const { token } = req.query;
    if (prpcheck(token as string)) return err400(res, "No Token given");
    const updParams = {
      currSecToken: undefined,
      currUsrOp: undefined,
      secTokExp: undefined,
    };
    const findParams = {
      where: {
        currSecToken: token,
        currUsrOp: "C",
        secTokExp: { $gt: nd },
      },
    };

    return User.update(updParams, findParams)
      .then((user) => {
        if (user[0] == 0)
          return err400(res, "no user found for this registration link");
        else
          return res
            .status(200)
            .json({ success: true, message: "confirmed account status" });
      })
      .catch((err) => err500(res, err, "Internal server error saving a user"));
  }

  Login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (prpcheck(email) || prpcheck(password))
      return err400(res, "Missing email/password");
    const getParams = {
      where: {
        email,
      },
      attributes: ["currUsrOp", "username", "password", "_id"],
    };
    return User.findOne(getParams)
      .then(async (user) => {
        if (user) {
          if (user.currUsrOp === "C")
            return err400(
              res,
              "this account is not yet validated. please check your email."
            );
          const { username, _id, password } = user;
          return bcrypt
            .compare(password, password)
            .then(async (match: boolean) => {
              if (match && user) {
                try {
                  const tk = await jwt.sign(
                    {
                      username,
                      email,
                      _id,
                    },
                    process.env.JWT_SECRET || "23rc8280rnm238x",
                    { expiresIn: "20d" }
                  );
                  return res.status(200).json({
                    success: true,
                    message: {
                      token: tk,
                    },
                  });
                } catch (err) {
                  return err400(res, "jwt validation error");
                }
              }
              return err400(res, "Incorrect password");
            })
            .catch((err: Error) => err500(res, err, "bcrypt error"));
        } else return err400(res, "user not found with this email");
      })
      .catch((err) => err500(res, err, "Internal server error getting a user"));
  }

  private fetchAllHelper = async (prp: string[] | undefined) => {
    if (prp)
      await prp.map(async (_id: string) => {
        const getParams = {
          where: { _id },
        };
        return await utilSchema.findOne(getParams);
      });
    return prp;
  };

  async getLikedutils(req: RequestUsr, res: Response) {
    const { likes } = req.user;
    try {
      const tmp = await this.fetchAllHelper(likes);
      return res.status(200).json({ success: false, message: tmp });
    } catch (e) {
      return err500(res, e, "Internal server error Getting Liked utils");
    }
  }

  getUserutils(req: Request, res: Response) {
    const { username } = req.params;
    const findParams = { where: { username } };
    return User.findOne(findParams)
      .then(async (usr) => {
        if (!usr || !usr.utils) return err400(res, "Error getting user");
        const tmp = await this.fetchAllHelper(usr.utils);
        return res.status(200).json({ success: false, message: tmp });
      })
      .catch((e) => err500(res, e, "Internal server error getting user util"));
  }

  async getCurrent(req: RequestUsr, res: Response) {
    const usr = req.user;
    if (!usr) return err400(res, "Error getting user");
    try {
      const tmp1 = await this.fetchAllHelper(usr.likes);
      const tmp2 = await this.fetchAllHelper(usr.utils);
      usr.likes = tmp1;
      usr.utils = tmp2;
    } catch (e) {
      return err500(res, e, "Internal server error getting curent user");
    }
    return res.status(200).json({ success: false, message: usr });
  }

  updateProp(req: RequestUsr, res: Response) {
    const reqBod = req.body;
    const { prop } = req.params;
    const { _id } = req.user;
    if (prpcheck(prop)) return err400(res, "missing type of item to update");

    if (prop === "username" || prop === "email") {
      const prp = reqBod[prop].trim();

      const updParams = {
        prp,
      };
      const findParams = { where: { _id } };

      return User.update(updParams, findParams).then((u) => {
        if (u[0] == 0) return err400(res, "No user found to update");
        return res.status(200).json({
          success: true,
          message: `Successfully updated ${prop}`,
        });
      });
    } else {
      return err400(res, "property to update must be email or username.");
    }
  }

  checkToken(req: RequestUsr, res: Response) {
    const nd = new Date();
    const { token } = req.params;
    if (prpcheck(token)) return err400(res, "missing/bad token");
    User.count({
      where: {
        currSecToken: token,
        secTokExp: { $gte: nd },
      },
    })
      .then((c) => {
        if (c == 0) return err400(res, "Token is invalid or has expired.");
        return res.status(200).json({
          success: true,
          message: "Valid reset token",
        });
      })
      .catch((e) => err500(res, e, "Internal server error checking token"));
  }

  async askResetPassword(req: RequestUsr, res: Response) {
    const { email } = req.user;
    if (prpcheck(email)) return err400(res, "missing/bad email");
    const token = await crypto.randomBytes(20).toString("hex");
    User.update(
      {
        currUsrOp: "R",
        currSecToken: token,
        secTokExp: new Date(Date.now() + 86400000),
      },
      {
        where: {
          email: email,
        },
      }
    )
      .then((u) => {
        if (u[0] == 0)
          return err400(res, "no user could be found to reset password");
        return;
      })
      .then(() =>
        sendMessage(
          "reset your password",
          `https://${process.env.HOST}/user/reset/${token}`,
          email
        )
      )
      .then(() =>
        res
          .status(200)
          .json({ success: true, message: "Sent password reset email" })
      )
      .catch((e) => err500(res, e, "Internal server error resetting password"));
  }

  ResetPassword(req: RequestUsr, res: Response) {
    const { password } = req.body;
    const { token } = req.params;
    if (prpcheck(password)) return err400(res, "missing/bad password");
    if (prpcheck(token)) return err400(res, "missing/bad token");
    const nd = new Date();
    hash(password, true)
      .then((hash) =>
        User.update(
          {
            password: hash,
            currSecToken: undefined,
            currUsrOp: undefined,
            secTokExp: undefined,
          },
          {
            where: {
              currSecToken: token,
              currUsrOp: "R",
              secTokExp: { $gt: nd },
            },
          }
        )
      )
      .then((u) => {
        if (u[0] == 0) {
          return err400(res, "Password reset token is invalid or has expired.");
        } else {
          res
            .status(200)
            .json({ success: true, message: "Password successfully reset" });
        }
      })
      .catch((err) => err500(res, err, "Error resetting password"));
  }

  async askAcctDelete(req: RequestUsr, res: Response) {
    const { email } = req.user;
    if (prpcheck(email)) return err400(res, "missing/bad email");
    const token = await crypto.randomBytes(20).toString("hex");
    User.update(
      {
        currUsrOp: "D",
        currSecToken: token,
        secTokExp: new Date(Date.now() + 86400000),
      },
      {
        where: {
          email: email,
        },
      }
    )
      .then((user) => {
        if (user[0] == 0) return err400(res, "No users found with this data");
        return;
      })
      .then(() =>
        sendMessage(
          "delete your account",
          `https://${process.env.HOST}/user/delete/${token}`,
          email
        )
      )
      .then(() =>
        res.status(200).json({ success: true, message: "Sent deletion email" })
      )
      .catch((e) => err500(res, e, "Internal server error deleting account"));
  }

  AcctDelete(req: RequestUsr, res: Response) {
    const { token } = req.params;
    const { _id } = req.user;
    const nd = new Date();
    return User.count({
      where: {
        currSecToken: token,
        currUsrOp: "D",
        secTokExp: { $gt: nd },
      },
    })
      .then((u) => {
        if (u == 0)
          return err400(
            res,
            "There was no user we found that could be deleted"
          );
        return;
      })
      .then(() =>
        req.user.destroy().then(() =>
          utilSchema.destroy({
            where: {
              authorId: _id,
            },
          })
        )
      )
      .then((u) => {
        if (u == 0)
          return err400(res, "Deletion token is invalid or has expired.");
        return res.status(200).json({
          success: true,
          message: "Removed your account.",
        });
      })
      .catch((e) => err500(res, e, "Internal server error resetting password"));
  }
}
