import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const deleteDirectory = data => post(url.DELETE_DIRECTORY, data);
export const deletePdf = data => post(url.DELETE_PDF, data);
export const getDetail = data => post(url.GET_DETAIL, data);
export const downloadDatabaseData = () => get(url.DUMP_DATABASE);