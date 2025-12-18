import express from 'express';
import {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/WarehouseSettingController.js';

const router = express.Router();

/* CREATE */
router.post('/warehouse-setting', createWarehouse);

/* READ */
router.get('/warehouse-setting', getWarehouses);

/* UPDATE */
router.put('/warehouse-setting/:id', updateWarehouse);

/* DELETE */
router.delete('/warehouse-setting/:id', deleteWarehouse);

export default router;
