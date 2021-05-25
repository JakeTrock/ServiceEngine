import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import initLogger from "../config/logger";
const logger = initLogger("CentralLogging");

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const jwsecret = process.env.JWT_SECRET || "23rc8280rnm238x";
    return jwt.verify(authHeader, jwsecret, (err, o) => {
      const out = o as User;
      if (err) res.status(400).json({ success: false, message: err.message });
      else if (out && out._id) {
        return User.findOne({ where: { _id: out._id } })
          .then((ex: User | null) => {
            if (ex) {
              out.currSecToken = "";
              out.password = "";
              req.user = out;
              return next();
            }
            return res
              .status(401)
              .json({ success: false, message: "Unauthenticated" });
          })
          .catch((e: Error) =>
            res.status(401).json({ success: false, message: err.message })
          );
      } else {
        return res.status(401).json({ success: false, message: "Blank token" });
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Missing token" });
  }
};

export const err400 = (res: Response, e: Error | string) => {
  return res.status(400).json({
    success: false,
    message: {
      success: false,
      details: typeof e == "object" ? e.message : e,
    },
  });
};

export const err500 = (res: Response, e: Error | string, descriptor = "") => {
  logger.error(descriptor + JSON.stringify(e));
  return res.status(500).json({
    success: false,
    message: {
      success: false,
      descriptor,
      details: typeof e == "object" ? e.message : e,
    },
  });
};

export const prpcheck = (prp: string | string[] | undefined) => {
  return !prp || prp == null || prp == "" || prp == undefined;
};
