import express from "express";
import {
  addFile,
  getBoxData,
  getFilDataFromBarcode,
  getWarehousingRecord,
  issueFile,
  returnFile,
  updateBoxData,
  updateSameBoxData,
} from "../controllers/warehouseController.js";

const router = express.Router();

router.post("/addFile", addFile);
router.post("/issueFile", issueFile);
router.post("/returnFile", returnFile);
router.post("/getFileDataFromBarcode", getFilDataFromBarcode);
router.post("/getWarehousingRecord", getWarehousingRecord);
router.get("/getBoxData", getBoxData);
router.post("/updateBoxData", updateBoxData);
router.post("/updateSameBoxData", updateSameBoxData);

export default router;
