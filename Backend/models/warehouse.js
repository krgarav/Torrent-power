import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';
import WarehouseMaster from './WarehouseMaster.js';

const Warehouse = sequelize.define('Warehouse', {
  boxNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shelfNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rackNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  floorNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issueReason: {
    type: DataTypes.STRING,
  },
  issueTo: {
    type: DataTypes.STRING,
  },
  issueBy: {
    type: DataTypes.STRING,
  },
  issueDate: {
    type: DataTypes.DATE,
  },
  currentStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  warehouseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
}
});

export default Warehouse;
