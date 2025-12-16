import express from 'express';
import {
  createWarehouse,
  getWarehouses,
} from '../controllers/WarehouseSettingController.js';

const router = express.Router();

/* CREATE WAREHOUSE */
router.post('/warehouse-setting', createWarehouse);

/* GET ALL WAREHOUSES */
router.get('/warehouse-setting', getWarehouses);

export default router;
