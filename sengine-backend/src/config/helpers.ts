import { APIGatewayProxyEventV2 } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import User from "../models/user";
import { IUser } from "./interfaces";

export const removeNullUndef = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == undefined || obj[key] == null || obj[key] == []) {
      delete obj[key];
    }
  });
  return obj;
};

export const logError = (e: Error | string, descriptor = "") => {
  console.log(
    Date.now().toString() + " : " + descriptor + " : " + (typeof e == "object")
      ? e.toString()
      : e
  );
};

export const err400 = (e: Error | string, descriptor = "") => {
  // logError(e, descriptor);
  //we prolly shouldnt log validation errors
  return {
    statusCode: 400,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: false,
      message: descriptor,
      details: typeof e == "object" ? e.message : e,
    }),
  };
};

export const err500 = (e: Error | string, descriptor = "") => {
  logError(e, descriptor);
  return {
    statusCode: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: false,
      message: descriptor,
      details: typeof e == "object" ? e.message : e,
    }),
  };
};

export const return200 = (m: object | String) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      message: typeof m == "object" ? m.toString() : m,
    }),
  };
};

export const Authenticate = (event: APIGatewayProxyEventV2): Promise<User> =>
  new Promise((resolve, reject) => {
    const authHeader = event.headers.authorization;
    if (authHeader) {
      const jwsecret = process.env.JWT_SECRET || "23rc8280rnm238x";
      return jwt.verify(authHeader, jwsecret, (err, o) => {
        const out = o as User;
        if (err) reject(err.message);
        else if (out && out._id) {
          return User.findOne({ _id: out._id })
            .then((ex: IUser) => {
              if (ex) {
                return resolve(ex);
              }
              return reject("Unauthenticated");
            })
            .catch((e: Error) => reject(e));
        } else {
          reject("blank token error");
        }
      });
    } else {
      return reject("Missing token");
    }
  });
