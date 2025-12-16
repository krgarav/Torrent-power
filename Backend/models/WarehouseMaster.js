import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const WarehouseMaster = sequelize.define(
  'warehouses_master',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouse_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_floors: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
    },
    updated_by: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default WarehouseMaster;
