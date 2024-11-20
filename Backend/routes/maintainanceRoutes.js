import express from 'express';
import { deleteDirectoryController, deletePdfController, downloadDatabaseData, getDetailsController } from '../controllers/MaintainanceController.js';

const app = express();
const router = express.Router();


router.post("/deleteDirectory", deleteDirectoryController);
router.post("/deletePdf", deletePdfController);
router.post("/getDetail", getDetailsController);
router.get("/downloadDatabaseData", downloadDatabaseData);

export default router;