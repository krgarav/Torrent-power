import FileData from "../models/FileData.js";
import Tagging from "../models/tagging.js";
import Warehouse from "../models/warehouse.js";
import { Op, where } from "sequelize";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const getAnalysisData = async (req, res) => {
//     try {
//         const fileData = await FileData.findAll();

//         const taggingData = await Tagging.findAll();
//         const warehouseData = await Warehouse.findAll();

//         const fileDataCount = fileData.length;
//         const warehouseCount = warehouseData.length;
//         const taggingCount = filterTaggingData(taggingData).length;
//         res.status(200).json({ success: true, message: "Analysis data", data: { fileDataCount, warehouseCount, taggingCount } });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: 'Error in get analysis data', error });
//     }
// }

export const getAnalysisData = async (req, res) => {
  try {
    // Run the database queries in parallel
    const [fileDataCount, taggingCount, warehouseCount] = await Promise.all([
      FileData.count(), // Get the count of rows in FileData table
      Tagging.count({
        where: {
          /* your filter conditions */
        },
      }), // Apply any conditions directly in the query
      Warehouse.count(), // Get the count of rows in Warehouse table
    ]);

    // Send the response with the counts
    res.status(200).json({
      success: true,
      message: "Analysis data",
      data: { fileDataCount, warehouseCount, taggingCount },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in get analysis data", error });
  }
};

// export const getTodayAnalysisData = async (req, res) => {
//     try {
//         // Get today's date in the format needed for your database
//         const today = new Date();
//         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//         // Fetch data created today
//         const fileData = await FileData.findAll({
//             where: {
//                 createdAt: {
//                     [Op.between]: [startOfDay, endOfDay]
//                 }
//             }
//         });
//         const taggingData = await Tagging.findAll({
//             where: {
//                 createdAt: {
//                     [Op.between]: [startOfDay, endOfDay]
//                 }
//             }
//         });

//         const warehouseData = await Warehouse.findAll({
//             where: {
//                 createdAt: {
//                     [Op.between]: [startOfDay, endOfDay]
//                 }
//             }
//         });

//         // Filter taggingData based on unique fileDataId if necessary
//         const filteredTaggingData = filterTaggingData(taggingData);

//         const fileDataCount = fileData.length;
//         const warehouseCount = warehouseData.length;
//         const taggingCount = filteredTaggingData.length;

//         res.status(200).json({
//             success: true,
//             message: "Analysis data",
//             data: {
//                 fileDataCount,
//                 warehouseCount,
//                 taggingCount
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: 'Error in get analysis data', error });
//     }
// };

export const getTodayAnalysisData = async (req, res) => {
  try {
    // Get today's date and set the start and end of the day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Run all queries in parallel and get counts for each table
    const [fileDataCount, taggingCount, warehouseCount] = await Promise.all([
      FileData.count({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      }),
      Tagging.count({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      }),
      Warehouse.count({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      }),
    ]);

    // If you need to apply custom filtering to taggingData, do it here
    // For example, if filterTaggingData checks for a condition like 'fileDataId' being unique, apply it in the query.
    const filteredTaggingCount = taggingCount; // Assuming you can do the filtering directly in the query, otherwise apply filtering here.

    // Send the response
    res.status(200).json({
      success: true,
      message: "Analysis data for today",
      data: {
        fileDataCount,
        warehouseCount,
        taggingCount: filteredTaggingCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching analysis data",
      error,
    });
  }
};
export const downloadDataCsv = async (req, res) => {
  try {
    const { from, to } = req.body;

    // Parse and validate the date range
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setUTCHours(23, 59, 59, 999);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range provided",
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: "'from' date should be earlier than 'to' date",
      });
    }

    // Fetch FileData within the date range
    const fileData = await FileData.findAll({
      where: {
        createdAt: {
          [Op.gte]: fromDate,
          [Op.lte]: toDate,
        },
      },
    });

    if (!fileData || fileData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the provided date range",
      });
    }

    // Log fileData count for debugging
    console.log(`Found ${fileData.length} records in the date range`);

    // Prepare to calculate total noOfPages and fetch related data
    let totalNoOfPages = 0;

    const fileDataList = await Promise.all(
      fileData.map(async (file) => {
        // Fetch related Tagging and Warehouse data
        const tagging = await Tagging.findAll({
          where: { fileDataId: file.id },
        });

        const filteredTagging = filterTaggingData(tagging); // Filter if needed

        const warehouse = await Warehouse.findAll({
          where: { fileDataId: file.id },
        });

        // Compute noOfPages (from file or filteredTagging)
        const noOfPages = file.noOfPages;
        totalNoOfPages += noOfPages;

        return {
          fileData: file,
          tagging: filteredTagging,
          warehouse,
          noOfPages,
        };
      })
    );

    // Log the total noOfPages for debugging
    console.log(`Total noOfPages: ${totalNoOfPages}`);

    // Generate the Excel file
    const filePath = await generateExcelFile(fileDataList);

    // Send the file as a response
    res.download(filePath, "data.xlsx", async (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        return res.status(500).send("Error downloading the file");
      }

      // Clean up the file after download
      try {
        await fs.unlink(filePath);
      } catch (unlinkErr) {
        console.error("Error deleting the file after download:", unlinkErr);
      }
    });
  } catch (error) {
    console.error("Error in generating the file:", error);

    // Send detailed error response for debugging (avoid leaking sensitive info in production)
    res.status(500).json({
      success: false,
      message: "Error in generating the Excel file",
      error: error.message,
    });
  }
};

// export const downloadDataCsv = async (req, res) => {
//   try {
//     const { from, to } = req.body;

//     // Parse the dates from the request body
//     const fromDate = new Date(from);
//     const toDate = new Date(to);
//     toDate.setUTCHours(23, 59, 59, 999);

//     // Validate the dates
//     if (isNaN(fromDate) || isNaN(toDate)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid date range" });
//     }

//     // Ensure the dates are in the correct order
//     if (fromDate > toDate) {
//       return res.status(400).json({
//         success: false,
//         message: '"from" date should be earlier than "to" date',
//       });
//     }

//     // Fetch FileData within the date range
//     const fileData = await FileData.findAll({
//       where: {
//         createdAt: {
//           [Op.gte]: fromDate,
//           [Op.lte]: toDate,
//         },
//       },
//     });

//     if (!fileData || fileData.length === 0) {
//       return res.status(404).json({ success: false, message: "No Data Found" });
//     }
//     // // Split the data based on barcode length
//     // const barcodesByLength = fileData.reduce(
//     //   (acc, item) => {
//     //     const barcode = item.barcode.trim(); // Trim spaces from start and end
//     //     if (barcode.length <= 5) {
//     //       acc.lessThanOrEqualTo5.push(item);
//     //     } else {
//     //       acc.greaterThan5.push(item);
//     //     }
//     //     return acc;
//     //   },
//     //   { lessThanOrEqualTo5: [], greaterThan5: [] }
//     // );

//     // const { lessThanOrEqualTo5, greaterThan5 } = barcodesByLength;

//     // Process data to include related Tagging and Warehouse info
//     const fileDataList = await Promise.all(
//       fileData.map(async (file) => {
//         const tagging = await Tagging.findAll({
//           where: { fileDataId: file.id },
//         });
//         const filteredTagging = filterTaggingData(tagging); // Assuming this filters as needed
//         const warehouse = await Warehouse.findAll({
//           where: { fileDataId: file.id },
//         });
//         const noOfPages = file.noOfPages;
//         // const noOfPages = filteredTagging.length;
//         return {
//           fileData: file,
//           tagging: filteredTagging,
//           warehouse: warehouse,
//           noOfPages: noOfPages,
//         };
//       })
//     );

//     // return;

//     // Generate the Excel file
//     const filePath = await generateExcelFile(fileDataList);

//     // Send the file as a response
//     res.download(filePath, "data.xlsx", async (err) => {
//       if (err) {
//         console.error("Error downloading the file:", err);
//         return res.status(500).send("Error downloading the file");
//       }

//       // Delete the file after download
//       try {
//         await fs.unlink(filePath);
//       } catch (unlinkErr) {
//         console.error("Error deleting the file:", unlinkErr);
//       }
//     });
//   } catch (error) {
//     console.error("Error generating the file:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in generating the Excel file",
//       error,
//     });
//   }
// };

// export const downloadDataCsv = async (req, res) => {
//   try {
//     const { from, to } = req.body;

//     // Parse the dates from the request body
//     const fromDate = new Date(from);
//     const toDate = new Date(to);
//     toDate.setUTCHours(23, 59, 59, 999);
//     if (isNaN(fromDate) || isNaN(toDate)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid date range" });
//     }

//     // Ensure the dates are in the correct order
//     if (fromDate > toDate) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: '"from" date should be earlier than "to" date',
//         });
//     }

//     // Fetch FileData within the date range
//     const fileData = await FileData.findAll({
//       where: {
//         createdAt: {
//           [Op.gte]: fromDate,
//           [Op.lte]: toDate,
//         },
//       },
//     });

//     const fileDataList = await Promise.all(
//       fileData.map(async (file) => {
//         const tagging = await Tagging.findAll({
//           where: { fileDataId: file.id },
//         });
//         const filteredTagging = filterTaggingData(tagging);
//         const warehouse = await Warehouse.findAll({
//           where: { fileDataId: file.id },
//         });
//         const noOfPages = file.noOfPages;
//         return {
//           fileData: file,
//           tagging: tagging,
//           warehouse: warehouse,
//           noOfPages,
//         };
//       })
//     );

//     if (fileDataList.length === 0) {
//       return res.status(404).json({ success: false, message: "No Data Found" });
//     }
//     // Generate the Excel file
//     const filePath = await generateExcelFile(fileDataList);

//     // Send the file as a response
//     res.download(filePath, "data.xlsx", async (err) => {
//       if (err) {
//         console.error("Error downloading the file:", err);
//         return res.status(500).send("Error downloading the file");
//       }

//       // Delete the file after download
//       try {
//         await fs.unlink(filePath);
//       } catch (unlinkErr) {
//         console.error("Error deleting the file:", unlinkErr);
//       }
//     });
//   } catch (error) {
//     console.error("Error generating the file:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Error in generating the Excel file",
//         error,
//       });
//   }
// };

export const generateExcelFile = async (data) => {
  const workbook = xlsx.utils.book_new();

  // Prepare a single sheet with multiple rows
  const sheetData = [];

  // Add headers
  sheetData.push([
    "Index",
    "Barcode",
    "Service",
    "Type of Request",
    "Collection Point",
    "Entry Date At",
    "Tagging Status",
    "Tagging Documents",
    "Warehousing Status",
    "Warehousing Details",
    "No Of Pages",
  ]);

  // Add data rows
  data.forEach((entry, index) => {
    let taggingDocuments = "";
    let a = entry.tagging.map((d) => {
      taggingDocuments += d.documentName + ", ";
    });
    // Add fileData information
    const fileDataRow = [
      index + 1,
      entry.fileData.barcode,
      entry.fileData.CSA,
      entry.fileData.typeOfRequest,
      entry.fileData.collectionPoint,
      entry.fileData.createdAt,
      entry.tagging.length > 0 ? "Done" : "Pending",
      taggingDocuments,
      entry.warehouse.length > 0 ? "Done" : "Pending",
    ];

    // Join details for Tagging and Warehousing
    const warehouseDetails = entry.warehouse
      .map(
        (wh) =>
          `Box: ${wh.boxNumber}, Shelf: ${wh.shelfNumber}, Rack: ${wh.rackNumber}`
      )
      .join("; ");
    const noOfPagesDetail = entry.noOfPages;
    // Add details to the row
    sheetData.push([...fileDataRow, warehouseDetails, noOfPagesDetail]);
  });

  // Create the sheet and add to the workbook
  const sheet = xlsx.utils.aoa_to_sheet(sheetData);
  xlsx.utils.book_append_sheet(workbook, sheet, "Data");

  const downloadDir = path.join(__dirname, "..", "downloads");
  const filePath = path.join(downloadDir, `${Date.now()}_data.xlsx`);

  try {
    // Ensure the downloads directory exists
    fs.mkdirSync(downloadDir, { recursive: true });

    // Write the workbook to the file
    xlsx.writeFile(workbook, filePath);
  } catch (err) {
    console.error("Error creating directory or writing file:", err);
    throw err;
  }

  return filePath;
};

const filterTaggingData = (data) => {
  const uniqueFileData = data.reduce((acc, item) => {
    // Check if the fileDataId is already in the accumulator
    if (!acc.find((entry) => entry.fileDataId === item.fileDataId)) {
      acc.push(item); // Add the item if its fileDataId is unique
    }
    return acc;
  }, []);
  return uniqueFileData;
};
