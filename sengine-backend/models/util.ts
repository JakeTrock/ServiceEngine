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
  public approved!: boolean;
  public langType!: string;
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
    fork: {
      type: DataTypes.UUID,
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
    approved: {
      type: DataTypes.NUMBER, //0,1,2 where respectively dissaproved,pending,approved
      defaultValue: 1,
    },
    langType: {
      type: DataTypes.ENUM,
      values: [
        "typescript",
        "csharp",
        "rust",
        "cpp",
      ],
      allowNull: false
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
