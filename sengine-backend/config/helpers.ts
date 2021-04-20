import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUser } from './types';

export const removeNullUndef = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == undefined || obj[key] == null || obj[key] == []) {
      delete obj[key];
    }
  });
  return obj;
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, out) => {
            if (err)res.status(400).json({ success: false, message: err.message });
            User.findById(out._id)
                .then((ex: IUser) => {
                    if (ex) {
                        req.user = out;
                        return next();
                    } return res.status(401).json({ success: false, message: 'Unauthenticated' });
                })
                .catch((e) => next(e));
        });
    } else {
        return res.status(401).json({ success: false, message: 'Missing token' });
    }
};

