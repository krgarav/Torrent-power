import express from 'express';
import { addFile, getFilDataFromBarcode, getWarehousingRecord, issueFile, returnFile } from '../controllers/warehouseController.js';


const router = express.Router();


router.post("/addFile", addFile);
router.post("/issueFile", issueFile);
router.post("/returnFile", returnFile);
router.post("/getFileDataFromBarcode", getFilDataFromBarcode);
router.post("/getWarehousingRecord", getWarehousingRecord);


export default router;