import mongoose, { Document } from "mongoose";
import { Request, Response } from "express";

export type comparePasswordFunction = (
  p1: string,
  p2: string,
  cb: (err: any, isMatch: any) => {}
) => void;

export type IUser = Document & {
  email: String;
  username: String;
  password: String;
  phone: String;
  currSecToken: String;
  currUsrOp: String;
  secTokExp: Date;
  utils: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  comparePassword: comparePasswordFunction;
};

export type util = Document & {
  authorId: mongoose.Schema.Types.ObjectId;
  title: String;
  description: String;
  tags: String[];
  permissions: String[];
  binHash: String;
  binLoc: String;
  srcLoc: String;
  srcType: String;
  jsonHash: String;
  jsonLoc: String;
  uses: Number;
  likes: Number;
  dislikes: Number;
};

export type UserReport = Document & {
  reason: string;
  reportedBy: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
};

export type utilReport = Document & {
  reason: string;
  reportedBy: mongoose.Schema.Types.ObjectId;
  util: mongoose.Schema.Types.ObjectId;
};

export interface NewRequest extends Request {
  user: IUser;
}
