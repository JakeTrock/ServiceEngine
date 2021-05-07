import { Sequelize, Model, DataTypes } from "sequelize";
const sequelize = new Sequelize("sqlite::memory:");

class utilSchema extends Model {
  public _id!: string;
  public authorId!: string;
  public forkChain?: string[];
  public title!: string;
  public description!: string;
  public tags!: string[];
  public permissions?: string[];
  public binHash!: string;
  public binLoc!: string;
  public srcLoc!: string;
  public jsonLoc!: string;
  public uses!: number;
  public likes!: number;
  public dislikes!: number;
}
utilSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    forkChain: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue("forkChain"));
      },
      set: function (val) {
        return this.setDataValue("forkChain", JSON.stringify(val));
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1500),
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    binHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    binLoc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    srcLoc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jsonLoc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uses: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Util",
    timestamps: true,
  }
);

export default utilSchema;
