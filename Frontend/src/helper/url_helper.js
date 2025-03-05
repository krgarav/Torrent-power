// const url = "http://192.168.0.2:8000/"
// export const url2 = "http://192.168.0.2:8000"

// const url = "http://192.168.1.17:8000/"
// export const url2 = "http://192.168.1.17:8000"

// const url = "http://10.144.6.12:3000/";
// export const url2 = "http://10.144.6.12:3000";
    const url = "http://localhost:4000/";
    export const url2 = "http://localhost:4000";

export default url + "createUser";
export const UPDATE_USER = url + "updateUser/";
export const GET_USERS = url + "getAllUsers";
export const LOGIN = url + "Login";
export const DELETE_USER = url + "deleteUser/";
export const GET_USER_ROLES = url + "GetUserRole";

export const SAVE_FILE_DATA = url + "saveFileData";
export const UPDATE_FILE_DATA = url + "updateFileData";
export const GET_ALL_FILEDATA = url + "getAllFilesData";
export const GET_FILE_DETAIL_DATA = url + "getFileDetailData";
export const GET_FILTER_FILES = url + "getFilterFiles";
export const GET_REPORT_DATA = url + "getReportData";
export const GET_TODAY_FILE_ENTRY_DATA = url + "getTodayFileEntryData";
export const EXPORT_REPORT_DATA = url + "exportReportData";
export const GET_SEARCH_FILE_DATA = url + "getSearchFileData";
export const GET_FILE_FROM_BARCODE = url + "getFileFromBarcode";
export const GET_FILE_FROM_CSA = url + "getFileFromCSA";
export const GET_FILEDATA_FROM_BOXNUMBER = url + "getBoxData";
export const PRINT_BARCODE = url + "printBarcode";

export const GET_ANALYSIS_DATA = url + "getAnalysisData";
export const GET_TODAY_ANALYSIS_DATA = url + "getTodayAnalysisData";
export const DOWNLOAD_DATA_CSV = url + "downloadDataCsv";
export const DOWNLOAD_ZIP_FILE = url + "downloadZipFile";
export const DOWNLOAD_PDF = url + "downloadPdf";

export const EXTRACT_PDF = url + "extractPdf";

export const ADD_FILE_TO_WAREHOUSE = url + "addFile";
export const ISSUE_FILE = url + "issueFile";
export const RETURN_FILE = url + "returnFile";
export const GET_FILE_DATA_FROM_BARCODE = url + "getFileDataFromBarcode";
export const GET_WAREHOUSING_RECORD = url + "getWarehousingRecord";
export const UPDATE_BOX_DATA = url + "updateBoxData";
export const UPDATE_SAME_BOX_DATA = url + "updateSameBoxData";

export const CREATE_PDF_FROM_IMAGES = url + "convertImagesToPdf";
export const CREATE_PDF_FROM_IMAGES_REPLACE = url + "convertImagesToPdfReplace";

export const DUMP_DATABASE = url + "downloadDatabaseData";

export const DELETE_DIRECTORY = url + "deleteDirectory";
export const DELETE_PDF = url + "deletePdf";
export const GET_DETAIL = url + "getDetail";

export const GET_PROCESS_DATA = url + "ProcessData";
export const SCAN_FILES = url + "ScanFiles";
export const REFRESH_SCANNER = url + "RefreshScanner";

export const GET_PROCESS_24_PAGE_DATA = url + "Process_24_Page_Booklet_Data";
export const SCAN_24_PAGE_FILES = url + "Scan_24_Page_Booklet";

export const GET_PROCESS_32_PAG_DATA = url + "Process_32_Page_Booklet_Data";
export const SCAN_32_PAGE_FILES = url + "Scan_32_Page_Booklet";
