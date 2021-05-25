import { Sequelize, Model, DataTypes } from "sequelize";
const sequelize = new Sequelize("sqlite::memory:");

class UserSchema extends Model {
  public _id!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public currSecToken?: string;
  public currUsrOp?: string;
  public secTokExp?: string; //TODO:should this be a str?
  public utils?: string[];
  public likes?: string[];
  public dislikes?: string[];
}
UserSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
          msg: "The email you provided was not correctly typed",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 20],
          msg: "Username must be between 2-20 characters",
        },
        is: {
          args: /^[a-zA-Z0-9_.]*$/,
          msg:
            "Username is improperly formatted(must be only characters a-z,0-9,period and underscore)",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currSecToken: {
      type: DataTypes.STRING,
    },
    currUsrOp: {
      type: DataTypes.STRING,
    },
    secTokExp: {
      type: DataTypes.STRING, //TODO:should this be a str or date?
    },
    utils: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue("utils"));
      },
      set: function (val) {
        return this.setDataValue("utils", JSON.stringify(val));
      },
    },
    likes: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue("likes"));
      },
      set: function (val) {
        return this.setDataValue("likes", JSON.stringify(val));
      },
    },
    dislikes: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue("dislikes"));
      },
      set: function (val) {
        return this.setDataValue("dislikes", JSON.stringify(val));
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

export default UserSchema;