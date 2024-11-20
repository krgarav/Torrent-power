import express from 'express';
import { downloadDataCsv, getAnalysisData, getTodayAnalysisData } from '../controllers/AnalysisController.js';

const app = express();
const router = express.Router();


router.get("/getAnalysisData", getAnalysisData);
router.get("/getTodayAnalysisData", getTodayAnalysisData);
router.post("/downloadDataCsv", downloadDataCsv);

export default router;