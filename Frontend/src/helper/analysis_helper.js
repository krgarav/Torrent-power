import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const downloadDataCsv = data => post(url.DOWNLOAD_DATA_CSV, data);
export const getAnalysisData = () => get(url.GET_ANALYSIS_DATA);
export const getTodayAnalysisData = () => get(url.GET_TODAY_ANALYSIS_DATA);