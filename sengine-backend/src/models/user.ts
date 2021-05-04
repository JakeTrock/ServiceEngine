const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

import initLogger from "../config/logger";
import utilSchema from "./util";

const logger = initLogger("UserModel");
class UserSchema extends Model {}
UserSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No email provided",
      },
      unique: {
        args: true,
        msg: "The email you provided was not unique",
      },
      is: {
        args: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
        msg: "The email you provided was not correctly typed",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "Username is required",
      },
      unique: {
        args: true,
        msg: "Username already exists",
      },
      min: {
        args: 2,
        msg: "Username must be at least 2 characters",
      },
      max: {
        args: 20,
        msg: "Username cannot be more than 20 characters",
      },
      is: {
        args: /^[a-zA-Z0-9_.]*$/,
        msg:
          "Username is improperly formatted(must be only characters a-z,0-9,period and underscore)",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "Password is required",
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No phone provided",
      },
    },
    currSecToken: {
      type: DataTypes.STRING,
    },
    currUsrOp: {
      type: DataTypes.STRING,
    },
    secTokExp: {
      type: DataTypes.STRING,//TODO:should this be a str or date?
    },
    utils: [
      {
        type: DataTypes.UUID,
        references: {
          model: utilSchema,
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    ],
    likes: [
      {
        type: DataTypes.UUID,
        references: {
          model: utilSchema,
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    ],
    dislikes: [
      {
        type: DataTypes.UUID,
        references: {
          model: utilSchema,
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    ],
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

utilSchema.hasMany(UserSchema);

export default UserSchema;
