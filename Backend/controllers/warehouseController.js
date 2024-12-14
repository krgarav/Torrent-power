import FileData from "../models/FileData.js";
import Warehouse from "../models/warehouse.js";

import { Op } from "sequelize";
export const addFile = async (req, res) => {
  const { boxNumber, shelfNumber, rackNumber, floorNumber, selectedCSA } =
    req.body;

  if (!boxNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Box Number is Required" });
  }
  if (!shelfNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Shelf Number is Required" });
  }
  if (!rackNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Rack Number is Required" });
  }
  if (!floorNumber) {
    return res
      .status(400)
      .json({ success: false, message: "floor Number is Required" });
  }
  if (!selectedCSA) {
    return res
      .status(400)
      .json({ success: false, message: "CSA or Barcode is Required" });
  }

  try {
    let file = await Warehouse.findOne({
      where: { fileDataId: selectedCSA?.id },
    });
    if (file) {
      let check = file.toJSON();
      if (check?.currentStatus == true) {
        return res.status(201).json({
          success: true,
          message: "File is Already in Warehouse",
        });
      }
    }

    const newFile = await Warehouse.create({
      boxNumber: boxNumber,
      shelfNumber: shelfNumber,
      rackNumber: rackNumber,
      floorNumber: floorNumber,
      fileDataId: selectedCSA?.id,
      currentStatus: true,
      createAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "File Added Successfully",
    });
  } catch (error) {
    console.error("Error in Add File:", error);
    res.status(500).json({
      success: false,
      message: "Error in Add File",
      error: error.message,
    });
  }
};

export const issueFile = async (req, res) => {
  const { fileIssueReason, issueTo, selectedCSA } = req.body;

  if (!fileIssueReason) {
    return res
      .status(400)
      .json({ success: false, message: "File Issue Reason is Required" });
  }
  if (!issueTo) {
    return res
      .status(400)
      .json({ success: false, message: "Issue to is Required" });
  }
  if (!selectedCSA) {
    return res.status(400).json({ success: false, message: "CSA is Required" });
  }

  try {
    let file = await Warehouse.findOne({
      where: { fileDataId: selectedCSA?.id },
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not available in the warehouse.",
      });
    }
    let check = file.toJSON();
    if (check.currentStatus == false) {
      return res.status(201).json({
        success: true,
        message: "File is Already Issued",
      });
    }
    file.issueReason = fileIssueReason;
    file.issueDate = new Date();
    file.issueTo = issueTo;
    file.currentStatus = false;

    await file.save();

    return res.status(201).json({
      success: true,
      message: "File Issued Successfully",
    });
  } catch (error) {
    console.error("Error in Issue file:", error);
    res.status(500).json({
      success: false,
      message: "Error in Issue File",
      error: error.message,
    });
  }
};

export const returnFile = async (req, res) => {
  const { boxNumber, shelfNumber, rackNumber, floorNumber, selectedCSA } =
    req.body;

  if (!boxNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Box Number is Required" });
  }
  if (!shelfNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Shelf Number is Required" });
  }
  if (!rackNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Rack Number is Required" });
  }
  if (!floorNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Floor Number is Required" });
  }
  if (!selectedCSA) {
    return res.status(400).json({ success: false, message: "CSA is Required" });
  }

  try {
    let file = await Warehouse.findOne({
      where: { fileDataId: selectedCSA?.id },
    });

    let check = file.toJSON();
    if (check.currentStatus == true) {
      return res.status(201).json({
        success: true,
        message: "File is Already in Warehouse",
      });
    }

    file.boxNumber = boxNumber;
    file.rackNumber = rackNumber;
    file.shelfNumber = shelfNumber;
    file.floorNumber = floorNumber;
    file.fileDataId = selectedCSA?.id;
    file.currentStatus = true;

    await file.save();

    res.status(201).json({
      success: true,
      message: "File Issued Successfully",
    });
  } catch (error) {
    console.error("Error in Return file:", error);
    res.status(500).json({
      success: false,
      message: "Error in Return File",
      error: error.message,
    });
  }
};

export const getFilDataFromBarcode = async (req, res) => {
  const { selectedCSA } = req.body;
  console.log(selectedCSA + ">>>>>>>>>>>>>>>>>>>>>");
  try {
    let file = await Warehouse.findOne({
      where: {
        fileDataId: {
          [Op.like]: `%${selectedCSA?.id}%`, // Adds a partial match condition
        },
      },
    });
    if (!file) {
      return res.status(201).json({
        success: false,
        message: "File with this Barcode is not available",
      });
    }
    res.status(201).json({
      success: true,
      message: "File Data",
      file,
    });
  } catch (error) {
    console.error("Error in Add File:", error);
    res.status(500).json({
      success: false,
      message: "Error in Getting File Data",
      error: error.message,
    });
  }
};

export const getWarehousingRecord = async (req, res) => {
  try {
    const { CSA } = req.body;

    // Find all file records matching the CSA
    const fileRecords = await FileData.findAll({ where: { CSA: CSA } });

    // Initialize an array to store the warehouse records
    const warehouseRecord = [];

    // Use a for...of loop to handle async operations
    for (const file of fileRecords) {
      // Find the corresponding warehouse record for each file
      const data = await Warehouse.findOne({ where: { fileDataId: file.id } });
      // Push the file and its corresponding warehouse data into the array
      if (data) {
        let finalData = {
          barcode: file?.barcode,
          CSA: file?.CSA,
          typeOfRequest: file?.typeOfRequest,
          collectionPoint: file?.collectionPoint,
          dateOfApplication: file?.dateOfApplication,
          boxNumber: data?.boxNumber,
          shelfNumber: data?.shelfNumber,
          rackNumber: data?.rackNumber,
          floorNumber: data?.floorNumber,
        };
        warehouseRecord.push(finalData);
      }
    }

    // Respond with the collected data
    res.status(201).json({
      success: true,
      message: "File Data",
      result: warehouseRecord,
    });
  } catch (error) {
    console.error("Error in Add File:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting data",
      error: error.message,
    });
  }
};

export const getBoxData = async (req, res) => {
  try {
    const { boxNumber } = req.query;

    // Find the corresponding warehouse record for each file
    const data = await Warehouse.findAll({
      where: { boxNumber: boxNumber },
      include: {
        model: FileData,
        attributes: [
          "id",
          "CSA",
          "barcode",
          "noOfPages",
          "typeOfRequest",
          "collectionPoint",
        ],
      },
      attributes: ["boxNumber", "id"],
    });

    // If no data found, return success as false
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data found for the given box number.",
      });
    }

    // Respond with the collected data if found
    res.status(201).json({
      success: true,
      message: "File Data retrieved successfully",
      result: data,
    });
  } catch (error) {
    console.error("Error in Add File:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting data",
      error: error.message,
    });
  }
};

export const updateBoxData = async (req, res) => {
  const { newBoxNumber, selfNumber, rackNumber, floorNumber, boxIds } =
    req.body;

  if (!newBoxNumber || !selfNumber || !rackNumber || !floorNumber || !boxIds) {
    return res.status(400).send({ message: "All fields are required." });
  }
  // console.log(newBoxNumber, selfNumber, rackNumber, floorNumber, boxIds )
  // return
  try {
    // Parse the boxIds string into an array if it's in string format
    const parsedBoxIds = JSON.parse(boxIds);
    // Check if newBoxNumber already exists

    const existingBox = await Warehouse.findOne({
      where: { boxNumber: newBoxNumber },
    });

    if (existingBox) {
      return res.status(400).send({
        success: false,
        message: `Box with number ${newBoxNumber} already exists.`,
      });
    }
    // Update all the specified columns for the matching boxIds
    const result = await Warehouse.update(
      {
        boxNumber: newBoxNumber,
        selfNumber,
        rackNumber,
        floorNumber,
      },
      {
        where: { id: parsedBoxIds }, // Assuming `id` is the column name for boxIds
      }
    );

    if (result[0] === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No boxes found to update." });
    }

    return res.status(200).send({
      success: true,
      message: "Boxes updated successfully.",
      updatedCount: result[0], // Number of rows updated
    });
  } catch (error) {
    console.error("Error updating boxes:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};

export const updateSameBoxData = async (req, res) => {
  const { BoxNumber, boxIds } = req.body;

  if (!BoxNumber || !boxIds) {
    return res.status(400).send({ message: "All fields are required." });
  }
  // console.log(newBoxNumber, selfNumber, rackNumber, floorNumber, boxIds )
  // return
  try {
    // Parse the boxIds string into an array if it's in string format
    const parsedBoxIds = JSON.parse(boxIds);
    // Check if newBoxNumber already exists

    const existingBox = await Warehouse.findOne({
      where: { boxNumber: BoxNumber },
    });

    if (!existingBox) {
      return res.status(400).send({
        success: false,
        message: `Box with number ${BoxNumber} does not exists.`,
      });
    }
    // Update all the specified columns for the matching boxIds
    const result = await Warehouse.update(
      {
        boxNumber: BoxNumber,
      },
      {
        where: { id: parsedBoxIds }, // Assuming `id` is the column name for boxIds
      }
    );

    if (result[0] === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No boxes found to update." });
    }

    return res.status(200).send({
      success: true,
      message: "Boxes updated successfully.",
      updatedCount: result[0], // Number of rows updated
    });
  } catch (error) {
    console.error("Error updating boxes:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error." });
  }
};
