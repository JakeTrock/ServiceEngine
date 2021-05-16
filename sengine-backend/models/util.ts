const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

import UserSchema from "./user";
class utilSchema extends Model {}
utilSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.UUID,
      references: {
        model: UserSchema,
        key: "_id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
      allowNull: {
        args: false,
        msg: "No authorid provided",
      },
    },
    forkChain: [
      {
        type: DataTypes.UUID,
        references: {
          model: UserSchema,
          key: "_id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
        allowNull: {
          args: false,
          msg: "No authorid provided",
        },
      },
    ],
    title: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No title provided",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No description provided",
      },
    },
    tags: [
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
    ],
    permissions: [
      {
        type: DataTypes.STRING,
      },
    ],
    binHash: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No binhash provided",
      },
    },
    binLoc: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No binary location provided",
      },
    },
    srcLoc: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No source location provided",
      },
    },
    jsonLoc: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: "No schema provided",
      },
    },
    uses: {
      type: DataTypes.NUMBER,
      default: 0,
    },
    likes: {
      type: DataTypes.NUMBER,
      default: 0,
    },
    dislikes: {
      type: DataTypes.NUMBER,
      default: 0,
    },
  },
  {
    sequelize,
    modelName: "Util",
    timestamps: true,
  }
);

UserSchema.hasMany(utilSchema);

export default utilSchema;
