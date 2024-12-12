import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const saveFileData = (data) => post(url.SAVE_FILE_DATA, data);
export const updateFileData = (data) => post(url.UPDATE_FILE_DATA, data);
export const getAllFilesData = () => get(url.GET_ALL_FILEDATA);
export const getFilterFilesData = (data) => post(url.GET_FILTER_FILES, data);
export const getFileDetailData = (data) => post(url.GET_FILE_DETAIL_DATA, data);
export const getReportData = () => post(url.GET_REPORT_DATA);
export const getTodayFileEntryData = () => get(url.GET_TODAY_FILE_ENTRY_DATA);
export const exportReportData = (data) => post(url.EXPORT_REPORT_DATA);
export const getFileFromBarcode = (data) =>
  post(url.GET_FILE_FROM_BARCODE, data);
export const getFileFromCSA = (data) => post(url.GET_FILE_FROM_CSA, data);
export const getFileDataFromBoxNumber = (data) =>
  get(`${url.GET_FILEDATA_FROM_BOXNUMBER}?boxNumber=${data}`);
