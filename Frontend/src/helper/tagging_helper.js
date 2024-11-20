import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const createPdfFromImages = data => post(url.CREATE_PDF_FROM_IMAGES, data);
export const createPdfFromImagesReplace = data => post(url.CREATE_PDF_FROM_IMAGES_REPLACE, data);
export const downloadZipFile = data => post(url.DOWNLOAD_ZIP_FILE, data);