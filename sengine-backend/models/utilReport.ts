import { Sequelize, Model, DataTypes } from "sequelize";
const sequelize = new Sequelize("sqlite::memory:");

class utilReportSchema extends Model {
  public _id!: string;
  public reportedBy!: string;
  public reason!: string;
  public util!: string;
}
utilReportSchema.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    util: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "utilReport",
    timestamps: true,
  }
);

export default utilReportSchema;