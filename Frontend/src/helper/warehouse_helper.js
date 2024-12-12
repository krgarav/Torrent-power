import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const addFiletoWarehouse = (data) =>
  post(url.ADD_FILE_TO_WAREHOUSE, data);
export const issueFile = (data) => post(url.ISSUE_FILE, data);
export const returnFile = (data) => post(url.RETURN_FILE, data);
export const getFileDataFromBarcode = (data) =>
  post(url.GET_FILE_DATA_FROM_BARCODE, data);
export const getWarehousingRecord = (data) =>
  post(url.GET_WAREHOUSING_RECORD, data);
export const updateBoxData = (data) => post(url.UPDATE_BOX_DATA, data);
