import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const fetchProcessData = () => get(url.GET_PROCESS_24_PAGE_DATA);
export const scanFiles = () => post(url.SCAN_24_PAGE_FILES);
export const refreshScanner = () => get(url.REFRESH_SCANNER);

