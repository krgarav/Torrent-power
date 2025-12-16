// model imports
import Warehouse from './models/warehouse.js';
import WarehouseMaster from './models/WarehouseMaster.js';
import FileData from './models/FileData.js';
import Tagging from './models/tagging.js';

// ================= MODEL RELATIONSHIPS =================

// FileData → Warehouse
Warehouse.belongsTo(FileData, { foreignKey: 'fileDataId' });
FileData.hasMany(Warehouse, { foreignKey: 'fileDataId' });

// WarehouseMaster → Warehouse
Warehouse.belongsTo(WarehouseMaster, { foreignKey: 'warehouseId' });
WarehouseMaster.hasMany(Warehouse, { foreignKey: 'warehouseId' });

// FileData → Tagging
Tagging.belongsTo(FileData, { foreignKey: 'fileDataId' });
