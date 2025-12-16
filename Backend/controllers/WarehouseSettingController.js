import WarehouseMaster from '../models/WarehouseMaster.js';

/* ================= CREATE WAREHOUSE ================= */
export const createWarehouse = async (req, res) => {
  try {
    const { warehouseName, totalFloors } = req.body;

    // Since you are NOT using auth / token
    const createdBy = 'system';

    if (!warehouseName || !totalFloors) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse name and floors are required',
      });
    }

    const warehouse = await WarehouseMaster.create({
      warehouse_name: warehouseName,
      total_floors: totalFloors,
      created_by: createdBy,
    });

    return res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse,
    });
  } catch (error) {
    console.error('Create Warehouse Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create warehouse',
    });
  }
};

/* ================= GET ALL WAREHOUSES ================= */
export const getWarehouses = async (req, res) => {
  try {
    const data = await WarehouseMaster.findAll({
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get Warehouses Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouses',
    });
  }
};
