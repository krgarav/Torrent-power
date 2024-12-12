import FileData from "../models/FileData.js";
import bwipjs from "bwip-js";
import fs from "fs";
import { Op } from "sequelize";
import Tagging from "../models/tagging.js";
import Warehouse from "../models/warehouse.js";
import sequelize from "../utils/db.js";
import xlsx from "xlsx";
import path from "path";

export const saveFileDataController = async (req, res) => {
  const {
    CSA,
    noOfPages,
    typeOfRequest,
    dateOfApplication,
    barcode,
    collPoint,
  } = req.body;
  const bcType = "code128";

  if (!CSA) {
    return res.status(400).json({ success: false, message: "CSA is required" });
  }
  if (!noOfPages) {
    return res
      .status(400)
      .json({ success: false, message: "No of pages is required" });
  }
  if (!typeOfRequest) {
    return res
      .status(400)
      .json({ success: false, message: "Type of request is required" });
  }
  if (!dateOfApplication) {
    return res
      .status(400)
      .json({ success: false, message: "Date of application is required" });
  }
  if (!barcode) {
    return res
      .status(400)
      .json({ success: false, message: "barcode is required" });
  }
  if (!collPoint) {
    return res
      .status(400)
      .json({ success: false, message: "collection point is required" });
  }

  try {
    let fileData = await FileData.findOne({ where: { barcode: barcode } });

    if (!fileData) {
      // Save the barcode CSA to the database
      try {
        fileData = await FileData.create({
          CSA: CSA,
          noOfPages: noOfPages,
          typeOfRequest: typeOfRequest,
          dateOfApplication: dateOfApplication,
          barcode: barcode,
          collectionPoint: collPoint,
          createAt: Date.now(),
        });
        return res
          .status(200)
          .json({ success: true, message: "File Save Successfully" });
      } catch (error) {
        console.error("Error saving barcode to database:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error in saving file" });
      }
    }

    return res
      .status(409)
      .json({ success: false, message: "Barcode already exists" });
  } catch (error) {
    console.error("Error generating barcode:", error);
    res.status(500).json({ success: false, message: "Error in saving file" });
  }
};
export const UpdateFileDataController = async (req, res) => {
  const {
    CSA,
    noOfPages,
    typeOfRequest,
    dateOfApplication,
    barcode,
    collPoint,
    selectedFileId,
  } = req.body;

  if (!CSA) {
    return res.status(400).json({ success: false, message: "CSA is required" });
  }
  if (!noOfPages) {
    return res
      .status(400)
      .json({ success: false, message: "No of pages is required" });
  }
  if (!typeOfRequest) {
    return res
      .status(400)
      .json({ success: false, message: "Type of request is required" });
  }
  if (!dateOfApplication) {
    return res
      .status(400)
      .json({ success: false, message: "Date of application is required" });
  }
  if (!barcode) {
    return res
      .status(400)
      .json({ success: false, message: "Barcode is required" });
  }
  if (!collPoint) {
    return res
      .status(400)
      .json({ success: false, message: "Collection point is required" });
  }

  try {
    let fileData = await FileData.findOne({ where: { id: selectedFileId } });

    if (!fileData) {
      // Create a new record if it doesn't exist

      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    } else {
      // Update the existing record
      await FileData.update(
        {
          barcode,
          CSA,
          noOfPages,
          typeOfRequest,
          dateOfApplication,
          collectionPoint: collPoint,
          updateAt: new Date(), // Use new Date() for current timestamp
        },
        {
          where: { id: selectedFileId },
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "File updated successfully" });
    }
  } catch (error) {
    console.error("Error processing file data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error processing file data" });
  }
};

export const getAllFilesDataController = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Fetch the data based on pagination
    const { count: totalFiles, rows: files } = await FileData.findAndCountAll({
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    });

    res.status(200).json({
      success: true,
      message: "All files data",
      data: files,
      totalRecords: totalFiles, // Send total count for pagination
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching files", error });
  }
};

export const searchFilesController = async (req, res) => {
  try {
    const searchQuery = req.query.search || ""; // Get the search query from request
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Fetch the data based on search and pagination
    const { count: totalFiles, rows: files } = await FileData.findAndCountAll({
      where: {
        [Op.or]: [
          { CSA: { [Op.like]: `%${searchQuery}%` } },
          { barcode: { [Op.like]: `%${searchQuery}%` } },
          { typeOfRequest: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    });

    res.status(200).json({
      success: true,
      message: "Search results",
      data: files,
      totalRecords: totalFiles, // Send total count for pagination
    });
  } catch (error) {
    console.error("Error searching files:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in searching files", error });
  }
};

export const searchFilesOnCSAController = async (req, res) => {
  try {
    const searchQuery = req.query.search || ""; // Get the search query from request

    // Fetch the data based on search and pagination
    const { rows: files } = await FileData.findAndCountAll({
      where: {
        [Op.or]: [
          { CSA: { [Op.like]: `%${searchQuery}%` } },
          { barcode: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
    });

    res.status(200).json({
      success: true,
      message: "Search results",
      data: files,
      totalRecords: totalFiles, // Send total count for pagination
    });
  } catch (error) {
    console.error("Error searching files:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in searching files", error });
  }
};

export const getFileDataBasedOnCondition = async (req, res) => {
  try {
    const { days } = req.body;

    // Calculate the date based on the number of days
    const daysInt = parseInt(days, 10);
    if (isNaN(daysInt)) {
      return res.status(400).json({ error: "Invalid number of days" });
    }
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const result = await FileData.findAll({
      where: {
        createdAt: {
          [Op.gte]: dateThreshold,
        },
      },
    });
    res
      .status(200)
      .json({
        success: true,
        message: "files based on the filter",
        data: result,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching files", error });
  }
};

export const getFileDataFromBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;
    console.log("barcode ", barcode);

    const result = await FileData.findOne({
      where: { barcode: { [Op.like]: `%${barcode}%` } },
    }); // Use 'findOne' instead of 'findAll'
    console.log("result ", result);
    res
      .status(200)
      .json({
        success: true,
        message: "files based on the filter",
        data: result,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching files", error });
  }
};

export const getFileDataFromCSA = async (req, res) => {
  try {
    const { CSA } = req.body;
    const result = await FileData.findOne({ where: { CSA: CSA } }); // Use 'findOne' instead of 'findAll'
    res
      .status(200)
      .json({
        success: true,
        message: "files based on the filter",
        data: result,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching files", error });
  }
};

export const getFileDetailData = async (req, res) => {
  try {
    const { fileDataId } = req.body;

    const tagging = await Tagging.findAll({
      where: { fileDataId: fileDataId },
    });

    const warehouse = await Warehouse.findAll({
      where: { fileDataId: fileDataId },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Detail data",
        result: { tagging, warehouse },
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in get data", error });
  }
};

export const getReoprtData = async (req, res) => {
  try {
    const fileData = await FileData.findAll({
      attributes: [
        "dateOfApplication",
        "collectionPoint",
        [sequelize.fn("COUNT", sequelize.col("id")), "fileCount"],
        [sequelize.fn("SUM", sequelize.col("noOfPages")), "totalPages"],
      ],
      group: ["dateOfApplication", "collectionPoint"],
      raw: true,
    });

    // Process data to group by date
    const groupedData = fileData.reduce((acc, item) => {
      // Convert dateOfApplication to string if it's not
      const date =
        item.dateOfApplication instanceof Date
          ? item.dateOfApplication.toISOString().split("T")[0] // Format date as YYYY-MM-DD
          : new Date(item.dateOfApplication).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = {
          Date: new Date(date),
          collectionPoint: "",
          files: 0,
          totalPages: 0,
          approved: false,
          subData: [],
        };
      }

      // Aggregate total files and pages for each date
      acc[date].files += parseInt(item.fileCount, 10);
      acc[date].totalPages += parseInt(item.totalPages, 10);

      // Add subData for each collection point
      const subDataEntry = acc[date].subData.find(
        (sub) => sub.collectionPoint === item.collectionPoint
      );
      if (subDataEntry) {
        subDataEntry.files += parseInt(item.fileCount, 10);
        subDataEntry.pages += parseInt(item.totalPages, 10);
      } else {
        acc[date].subData.push({
          date: new Date(date),
          collectionPoint: item.collectionPoint || "",
          files: parseInt(item.fileCount, 10),
          totalPages: parseInt(item.totalPages, 10),
          priority: "Normal",
          approved: false,
        });
      }

      return acc;
    }, {});

    // Convert the object to an array
    const result = Object.values(groupedData);

    // Sort the data by date in descending order (latest date first)
    result.sort((a, b) => b.Date - a.Date);
    console.log(result[0]);
    // Send the formatted data as a response
    res
      .status(200)
      .json({ success: true, message: "Reoprt Data", result: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in getting report data", error });
  }
};

export const getTodayFileEntryData = async (req, res) => {
  try {
    // Get the start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Fetch tagging data created today
    const data = await FileData.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
    });
    const result = [];
    for (const d of data) {
      console.log(d.toJSON());
      let a = d.toJSON();
      const taggingData = await Tagging.findAll({
        where: { fileDataId: a.id },
      });
      if (taggingData.length > 0) {
        a.tagging = true;
      } else {
        a.tagging = false;
      }

      const warehousingData = await Warehouse.findAll({
        where: { fileDataId: a.id },
      });
      if (warehousingData.length > 0) {
        a.warehouse = true;
      } else {
        a.warehouse = false;
      }

      result.push(a);
    }

    res.status(200).json({ success: true, message: "Detail data", result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in getting data", error });
  }
};

export const exportReportData = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;
   
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
 
    // Fetch data with grouped attributes (based on createdAt)
const fileData = await FileData.findAll({
  attributes: [
    [sequelize.fn("DATE", sequelize.col("createdAt")), "createdDate"], // Group by the date part of createdAt
    "collectionPoint",
    [sequelize.fn("COUNT", sequelize.col("id")), "fileCount"],
    [sequelize.fn("SUM", sequelize.col("noOfPages")), "totalPages"],
  ],
  group: ["createdDate", "collectionPoint"], // Group by createdDate and collectionPoint
  raw: true,
  where: {
    createdAt: {
      [Op.gte]: startDate,
      [Op.lte]: adjustedEndDate, // Adjusted to include the entire end date
    },
    // barcode: {
    //   [Op.gt]: 100000, // Include fileData with barcode > 100,000
    // },
  },
});

// Debugging: Log the fetched data to ensure correctness
console.log("Grouped File Data by CreatedAt:", fileData);

// Process data to group by createdDate
const groupedData = fileData.reduce((acc, item) => {
  const date = item.createdDate; // Already formatted as a date string (YYYY-MM-DD)

  // Create a new entry for each unique date
  if (!acc[date]) {
    acc[date] = {
      Date: new Date(date),
      subData: [],
      totalFiles: 0,
      totalPages: 0, // Initialize totals
    };
  }

  // Aggregate data for each collection point
  acc[date].subData.push({
    collectionPoint: item.collectionPoint || "",
    files: parseInt(item.fileCount, 10),
    totalPages: parseInt(item.totalPages, 10),
    priority: "Normal",
    approved: false,
  });

  // Update total files and pages for the date
  acc[date].totalFiles += parseInt(item.fileCount, 10);
  acc[date].totalPages += parseInt(item.totalPages, 10);

  return acc;
}, {});
    // const fileData = await FileData.findAll({
    //   attributes: [
    //     "dateOfApplication",
    //     "collectionPoint",
    //     [sequelize.fn("COUNT", sequelize.col("id")), "fileCount"],
    //     [sequelize.fn("SUM", sequelize.col("noOfPages")), "totalPages"],
    //   ],
    //   group: ["dateOfApplication", "collectionPoint"],
    //   raw: true,
    //   where: {
    //     createdAt: {
    //       [Op.gte]: startDate,
    //       [Op.lt]: adjustedEndDate, // Use Op.lt with the adjusted end date to include the entire end date
    //     },
    //     barcode: {
    //       [Op.gt]: 100000, // Only include fileData with barcode greater than 100,000
    //     },
    //   },
    // });

    // // Process data to group by date
    // const groupedData = fileData.reduce((acc, item) => {
    //   const date =
    //     item.dateOfApplication instanceof Date
    //       ? item.dateOfApplication.toISOString().split("T")[0]
    //       : new Date(item.dateOfApplication).toISOString().split("T")[0];

    //   if (!acc[date]) {
    //     acc[date] = {
    //       Date: new Date(date),
    //       subData: [],
    //     };
    //   }

    //   // Aggregate total files and pages for each date
    //   acc[date].subData.push({
    //     collectionPoint: item.collectionPoint || "",
    //     files: parseInt(item.fileCount, 10),
    //     totalPages: parseInt(item.totalPages, 10),
    //     priority: "Normal",
    //     approved: false,
    //   });

    //   return acc;
    // }, {});

    // Convert the object to an array
    const result = Object.values(groupedData);

    // Sort the data by date in descending order (latest date first)
    result.sort((a, b) => b.Date - a.Date);

    // Initialize the workbook and worksheet data
    const wb = xlsx.utils.book_new();
    const ws_data = [
      [
        "S no.",
        "Date",
        "Jaipur House",
        "",
        "Pratap Pura",
        "",
        "Sanjay Palace",
        "",
        "Total Files",
        "Total Pages",
      ],
      [
        "",
        "",
        "File Record",
        "Pages",
        "File Record",
        "Pages",
        "File Record",
        "Pages",
        "",
        "",
      ],
    ];

    // Fill the worksheet data dynamically
    result.forEach((item, index) => {
      const row = [index + 1, item.Date.toISOString().split("T")[0]];
      const collectionPoints = ["Jaipur House", "Pratap Pura", "Sanjay Palace"];

      let totalFiles = 0;
      let totalPages = 0;

      collectionPoints.forEach((point) => {
        const subDataEntry = item.subData.find(
          (sub) => sub.collectionPoint === point
        );
        if (subDataEntry) {
          row.push(subDataEntry.files, subDataEntry.totalPages);
          totalFiles += subDataEntry.files;
          totalPages += subDataEntry.totalPages;
        } else {
          row.push(0, 0);
        }
      });

      row.push(totalFiles, totalPages);
      ws_data.push(row);
    });

    // Create a worksheet and apply styles
    const ws = xlsx.utils.aoa_to_sheet(ws_data);

    // Apply merge and style
    ws["!merges"] = [
      { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // Merges "Jaipur House" and the next column
      { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } }, // Merges "Pratap Pura" and the next column
      { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } }, // Merges "Sanjay Palace" and the next column
    ];

    // Style the merged cells
    const centerStyle = {
      alignment: { horizontal: "center", vertical: "center" },
    };

    ws["A1"].s = centerStyle;
    ws["B1"].s = centerStyle;
    ws["C1"].s = centerStyle;
    ws["D1"].s = centerStyle;
    ws["E1"].s = centerStyle;
    ws["F1"].s = centerStyle;
    ws["G1"].s = centerStyle;
    ws["H1"].s = centerStyle;
    ws["I1"].s = centerStyle;
    ws["J1"].s = centerStyle;

    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate Excel file and send it to the frontend
    const filePath = path.join("output_sample.xlsx");
    xlsx.writeFile(wb, filePath);

    res.download(filePath, "output_sample.xlsx", (err) => {
      if (err) {
        console.error("Error sending the file:", err);
        res.status(500).send("Error generating file");
      } else {
        // Optionally delete the file after sending
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in getting report data", error });
  }
};
