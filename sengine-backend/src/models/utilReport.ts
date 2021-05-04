const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

import UserSchema from "./user";
import utilSchema from "./util";

class utilReportSchema extends Model {}
utilReportSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reportedBy: {
      type: DataTypes.UUID,
      references: {
        model: UserSchema,
        key: "_id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
      allowNull: {
        args: false,
        msg: "No user provided",
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No description provided",
      },
    },
    util: {
      type: DataTypes.UUID,
      references: {
        model: utilSchema,
        key: "_id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
      allowNull: {
        args: false,
        msg: "No util provided",
      },
    },
  },
  {
    sequelize,
    modelName: "utilReport",
    timestamps: true,
  }
);

UserSchema.hasMany(utilReportSchema);

utilSchema.hasMany(utilReportSchema);

export default utilReportSchema;
