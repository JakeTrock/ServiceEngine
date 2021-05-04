import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import crypto from "crypto";
import * as AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import s3 from '../core/s3';
import User from "./models/user";
import utilSchema from "./models/util";
import { Authenticate, err400, err500, return200 } from "./config/helpers";
import { IUser } from "./config/interfaces";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
};
AWS.config.update({ credentials, region: "us-east-1" });

const SES = new AWS.SES();

const s3 = new AWS.S3();
const s3Bucket = process.env.BUCKET_NAME;

const hash = (pass: string, isPwd: boolean) => {
  const pwd = pass.trim();
  return bcrypt.genSalt(10, (err: Error, salt) => {
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

export const signup: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { username, email, password, phone } = JSON.parse(event.body);
  return crypto.randomBytes(20, async (err, buffer) => {
    const token = buffer.toString("hex");
    const pw = await hash(password, true);
    const ph = await hash(phone, false);
    return User.create({
      email: email.trim(),
      password: pw,
      phone: ph,
      username: username.trim().toLowerCase(),
      currUsrOp: "R",
      currSecToken: token,
      secTokExp: new Date(Date.now() + 86400000),
    })
      .then((user: IUser) =>
        SES.sendEmail({
          Destination: {
            ToAddresses: [user.email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `To verify your account click the following link or paste it into your browser<br/><br/> https://${process.env.HOST}/user/confirm/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
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
      .then(() => return200("Successfully signed up."))
      .catch((err: Error) => {
        if (err) {
          return err400(err, "Error when saving a user");
        }
      });
  });
};

export const login: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { email, password } = JSON.parse(event.body);
  return User.findOne({
    email,
  })
    .then((user: IUser) =>
      bcrypt
        .compare(password, user.password)
        .then((match: boolean) => {
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
              (err: Error, tk: String) => {
                if (err) return err400(err, "jwt error");
                return return200({
                  token: tk,
                });
              }
            );
          }
          return err400("Incorrect password");
        })
        .catch((err: Error) => err500(err, "bcrypt error"))
    )
    .catch((e: Error) => err500(e.message, "user fetch error"));
};

export const getUserLiked: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { username } = Authenticate(event);
  return User.findOne({ username })
    .then((usr: User) => {
      return return200(usr.likes);
    })
    .catch((e: Error) =>
      err500(e, `Error getting user by username: ${username}`)
    );
};

export const getUserUtils: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { username } = Authenticate(event);
  return User.findOne({ username })
    .then((usr: User) => {
      return return200(usr.utils);
    })
    .catch((e: Error) =>
      err500(e, `Error getting user by username: ${username}`)
    );
};

export const getCurrent: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { username } = Authenticate(event);
  return User.findOne({ username })
    .then((usr: User) => {
      return return200(usr);
    })
    .catch((e: Error) =>
      err500(e, `Error getting user by username: ${username}`)
    );
};

export const updateProp: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { prop } = event.queryStringParameters;
  const { _id } = Authenticate(event);
  const reqBod = JSON.parse(event.body);
  if (prop === "phone" || prop === "username" || prop === "email") {
    const prp = reqBod[prop].trim();
    return User.findOne(_id)
      .then(async (u: IUser) => {
        if (prop === "email") {
          const phone = reqBod.phone.trim();
          const bc = await bcrypt.compare(phone, u.phone);
          if (bc) {
            return u;
          } else {
            throw err400(`Invalid ${prop}`);
          }
        } else {
          return u;
        }
      })
      .then((u: User) =>
        u
          .update({ prp })
          .then(() => return200(`Successfully updated ${prop}`))
          .catch((error: Error) =>
            err500(error, `Error updating ${prop} to ${prp} for user ${_id}`)
          )
      );
  } else {
    return err400("property to update must be a phone, email or username.");
  }
};

export const checkToken: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const nd = new Date();
  const { token } = event.queryStringParameters;
  return User.findOne({
    currSecToken: token,
    secTokExp: { $gte: nd },
  })
    .then(() => return200("Valid reset token"))
    .catch(() => err400("Token is invalid or has expired."));
};

export const askResetPassword: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { email } = JSON.parse(event.body);
  return crypto.randomBytes(20, (err, buffer) => {
    const token = buffer.toString("hex");
    return User.update(
      {
        currUsrOp: "R",
        currSecToken: token,
        secTokExp: new Date(Date.now() + 86400000),
      },
      {
        returning: true,
        where: {
          email,
        },
      }
    )
      .then((user: User) =>
        SES.sendEmail({
          Destination: {
            ToAddresses: [user.email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `To reset your password click the following link or paste it into your browser<br/><br/> https://${process.env.HOST}/user/reset/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
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
      .then(() => return200("Sent password reset email"))
      .catch((err: Error) => err500(err, "Error fetching user"));
  });
};

export const ResetPassword: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { password } = JSON.parse(event.body);
  const { token } = event.queryStringParameters;
  const nd = new Date();
  return hash(password, true)
    .then((hash: string) =>
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
            currSecToken: token,
            currUsrOp: "R",
            secTokExp: { $gt: nd },
          },
        }
      )
    )
    .then((u: User) => {
      if (!u) {
        return err400("Password reset token is invalid or has expired.");
      } else {
        return return200("Password successfully reset");
      }
    })
    .catch((err: Error) => err500(err, "Error resetting password"));
};

export const askAcctDelete: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const { email } = JSON.parse(event.body);
  return crypto.randomBytes(20, (err: Error, buffer) => {
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
          email,
        },
      }
    )
      .then((user: User) =>
        SES.sendEmail({
          Destination: {
            ToAddresses: [user.email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `To reset your password click the following link or paste it into your browser<br/><br/> https://${process.env.HOST}/user/delete/${token}<br/><br/>If you didn't make this request, then ignore the email and you'll be safe<br/>`,
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
      .then(() => return200("Sent deletion email"))
      .catch((err: Error) => err500(err, "error fetching user"));
  });
};

export const AcctDelete: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const nd = new Date();
  const { token } = event.queryStringParameters;
  return User.destroy({
    returning: true,
    where: {
      currSecToken: token,
      currUsrOp: "D",
      secTokExp: { $gt: nd },
    },
  })
    .then((usr: User) =>
      utilSchema.destroy({
        returning: true,
        where: {
          authorId: usr._id,
        },
      })
    )
    .then((u: User) => {
      if (!u) {
        return err400("Deletion token is invalid or has expired.");
      }
      return return200("Removed your account.");
    })
    .catch((err: Error) => err500(err, "Error resetting password"));
};
