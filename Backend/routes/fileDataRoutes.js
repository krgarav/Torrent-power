import express from 'express';
import { exportReportData, getAllFilesDataController, getFileDataBasedOnCondition, getFileDataFromBarcode, getFileDataFromCSA, getFileDetailData, getReoprtData, getTodayFileEntryData, saveFileDataController, searchFilesController, UpdateFileDataController } from '../controllers/FileDataController.js';

const app = express();
const router = express.Router();


router.post("/saveFileData", saveFileDataController);
router.post("/updateFileData", UpdateFileDataController);
router.get("/getAllFilesData", getAllFilesDataController);
router.post("/getFilterFiles", getFileDataBasedOnCondition);
router.post("/getFileDetailData", getFileDetailData);
router.post("/getReportData", getReoprtData);
router.post("/exportReportData", exportReportData);
router.get("/getTodayFileEntryData", getTodayFileEntryData);
router.get('/getSearchFileData', searchFilesController);

router.post("/getFileFromBarcode", getFileDataFromBarcode);
router.post("/getFileFromCSA", getFileDataFromCSA);
export default router;