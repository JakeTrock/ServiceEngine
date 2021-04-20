import mongoose, { Schema, Document } from "mongoose";
import express from "express";
import bcrypt from "bcrypt";

import initLogger from "../config/logger";
import { IUser, comparePasswordFunction } from "../config/types";

const logger = initLogger("UserModel");
const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]*$/;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "No email provided"],
      unique: [true, "The email you provided was not unique"],
      match: [
        /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
        "The email you provided was not correctly typed",
      ],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [20, "Username cannot be more than 20 characters"],
      match: [
        /^[a-zA-Z0-9_.]*$/,
        "Username is improperly formatted(must be only characters a-z,0-9,period and underscore)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password length must be at least 6 characters"],
      maxlength: [50, "Password has a maximum length of 50 characters"],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]*$/,
        "Password must contain at least one upper case character, one lower case character, and one number",
      ],
      select: false,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "No phone provided"],
    },
    currSecToken: {
      type: String,
    },
    currUsrOp: {
      type: String,
    },
    secTokExp: {
      type: Date,
    },
    utils: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "util",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "util",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "util",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function save(next) {
  const user = this as IUser;
  if (!user.isModified("password")) {
    return next();
  }
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      logger.error(`Error while generating salt with bcrypt: ${err}`);
      return next(err);
    }
    return bcrypt.hash(user.password, salt, (err1: mongoose.Error, hash) => {
      if (err1) {
        logger.error(`Error while hashing a password with bcrypt: ${err1}`);
        return next(err1);
      }
      user.password = hash;
      return next();
    });
  });
});

export default mongoose.model<IUser>("User", UserSchema);
