import { Request } from "express";
import UserSchema from "../models/user";
export default interface RequestUsr extends Request {
  user: UserSchema;
}
