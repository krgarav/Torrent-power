import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const FileData = sequelize.define(
  "FileData",
  {
    CSA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    noOfPages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeOfRequest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collectionPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfApplication: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "filedata",
    freezeTableName: true,
    timestamps: true, // ✅ creates & manages createdAt, updatedAt
  }
);

export default FileData;
