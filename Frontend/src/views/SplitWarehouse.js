import NormalHeader from "components/Headers/NormalHeader";
import React, { useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Toolbar,
  ExcelExport,
  Filter,
} from "@syncfusion/ej2-react-grids";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getFileDataFromBoxNumber } from "helper/fileData_helper";
const SplitWarehouse = () => {
  const [selectedBoxNumber, setSelectedBoxNumber] = useState("");
  const [BarcodeData, setBarcodeData] = useState([]);
  const [search, setSearch] = useState("");
  const [headData, setHeadData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newBoxNumber, setNewBoxNumber] = useState(null);
  const [newRackNumber, setNewRackNumber] = useState(null);
  const [newSelfNumber, setNewSelfNumber] = useState(null);
  const [newFloorNumber, setNewFloorNumber] = useState(null);
  const [spanDisplay, setSpanDisplay] = useState("none");
  const handleRowSelected = (args) => {
    // Add the selected row data to the state
    setSelectedRows((prevRows) => [...prevRows, args.data]);
  };

  const handleRowDeselected = (args) => {
    // Remove the deselected row data from the state
    setSelectedRows((prevRows) => prevRows.filter((row) => row !== args.data));
  };
  const handleFileSelectFromBarcode = async (barcode) => {
    function transformResult(result) {
      return result.map((item) => {
        const { boxNumber, id, FileDatum } = item;
        return {
          id,
          boxNumber,
          CSA: FileDatum.CSA,
          barcode: FileDatum.barcode,
          noOfPages: FileDatum.noOfPages,
          typeOfRequest: FileDatum.typeOfRequest,
          collectionPoint: FileDatum.collectionPoint,
        };
      });
    }
    // console.log(barcode);
    try {
      const data = await getFileDataFromBoxNumber(barcode);
      console.log(data);
      if (data?.success) {
        if (data?.result != null) {
          const transformedData = transformResult(data?.result);
          const newDataKeys = Object.keys(transformedData[0])
            .map((key) => {
              return key.endsWith(".") ? key.slice(0, -1) : key;
            })
            .filter((item) => item !== "id");
          console.log(newDataKeys);
          let num = 1;
          let updatedData = transformedData.map((item) => {
            const newItem = {};
            for (const key in item) {
              const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
              newItem[newKey] = item[key];
            }
            newItem["Serial No"] = num++;
            return newItem;
          });
          setHeadData(["Serial No", ...newDataKeys]);
          setSourceData(updatedData);
          setBarcodeData(data?.result);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const handleBarcodeChange = (selectedOption) => {
    setSelectedBoxNumber(selectedOption);
    setBarcodeData(selectedOption);
  };
  const handleBarcodeInputChange = (inputValue) => {
    handleFileSelectFromBarcode(inputValue);
  };
  const handleSearch = () => {
    handleFileSelectFromBarcode(search);
  };
  const handleSearchChange = (e) => {
    // handleFileSelectFromBarcode;
    setSearch(e.target.value);
  };
  const handleAddFileSubmit = () => {
    // if (!newBoxNumber) {
    //   setSpanDisplay("inline");
    //   return;
    // }
    // if (!newRackNumber) {
    //   setSpanDisplay("inline");
    //   return;
    // }
    // if (!newSelfNumber) {
    //   setSpanDisplay("inline");
    //   return;
    // }
    // if (!newFloorNumber) {
    //   setSpanDisplay("inline");
    //   return;
    // }
    console.log(selectedRows);
    // selectedRows
    if (selectedRows) {
      const data = selectedRows.map((item) => {
        return item.id;
      });
      console.log(data);
    }
    // const ExtractIDs = (item) => {
    //   item
    // };
  };
  const columnsDirective = headData.map((item, index) => {
    return (
      <ColumnDirective
        field={`${item}`}
        key={index}
        headerText={item}
        width="120"
        textAlign="Center"
      ></ColumnDirective>
    );
  });

  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h1 className="mt-2">Split Box Section</h1>
                </div>
                <Row className="mb-3">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-3 col-form-label"
                  >
                    Enter Box number :
                  </label>
                  <div className=" col-md-9">
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control  "
                        placeholder="Enter Box Number that you want to split."
                        value={search}
                        onChange={handleSearchChange}
                      />
                      <Button
                        className="ml-2 "
                        color="info"
                        type="button"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </div>

                  {/* <div className="col-md-9">
                    <Select
                      value={selectedBoxNumber}
                      onChange={handleBarcodeChange}
                      onInputChange={handleBarcodeInputChange}
                      options={BarcodeData}
                      getOptionLabel={(option) => option?.boxNumber}
                      getOptionValue={(option) => option?.id?.toString()} // Convert to string if classId is a number
                      classNamePrefix="select2-selection"
                      placeholder="Enter barcode to search"
                    />
                    {!selectedBoxNumber && (
                      <span style={{ color: "red", display: "none" }}>
                        This feild is required
                      </span>
                    )}
                  </div> */}
                </Row>
                {sourceData.length !== 0 && (
                  <>
                    <Row>
                      <h3>
                        Total File in <span style={{}}>{search}</span> Box File
                      </h3>
                      <GridComponent
                        // ref={gridRef}
                        // dataBound={dataBound}
                        // actionComplete={handleSave}
                        dataSource={sourceData}
                        height={"400"}
                        width={"100%"}
                        selectionSettings={{
                          type: "Multiple",
                          persistSelection: true,
                        }}
                        allowSorting={true}
                        rowSelected={handleRowSelected} // Event for row selection
                        rowDeselected={handleRowDeselected} // Event for row deselection
                        // editSettings={editSettings}
                        // allowFiltering={false}
                        // filterSettings={filterSettings}
                        // // toolbar={toolbar}
                        // enableVirtualization={isAutoScrollEnabled}
                        // toolbarClick={handleToolbarClick}
                        // allowExcelExport={true}
                        // allowPdfExport={false}
                        // allowEditing={false}
                        // emptyRecordTemplate={template.bind(this)}
                        // rowDataBound={rowDataBound}
                        // queryCellInfo={queryCellInfo}
                      >
                        <ColumnsDirective>
                          <ColumnDirective
                            type="checkbox"
                            width="50"
                            textAlign="Center"
                          />
                          {columnsDirective}
                        </ColumnsDirective>
                      </GridComponent>
                    </Row>
                    <Row className="d-flex justify-content-center">
                      <Button
                        className="mt-4 "
                        color="primary"
                        type="button"
                        onClick={() => {
                          console.log(selectedRows);
                          setShowSplitModal(true);
                        }}
                      >
                        Split Data
                      </Button>
                    </Row>
                  </>
                )}
                <Modal
                  show={showSplitModal}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Split Box File
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ overflow: "auto", height: "70vh" }}>
                    {/* {csaOldRecord && (
                      <>
                        <h1>
                          {csaOldRecord?.length} File of this costumer is
                          already exists in warehouse
                        </h1>

                        {csaOldRecord.map((d, i) => (
                          <>
                            <div className="m-4">
                              <b>{i + 1}.</b>
                              <div className="mx-3">
                                <h4>Barcode: {d?.barcode}</h4>
                                <h4>
                                  Type of Application: {d?.typeOfApplication}
                                </h4>
                                <h4>
                                  Date of Application: {d?.dateOfApplication}
                                </h4>
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    )} */}
                    <div className="shadow p-3 mb-5 bg-white rounded">
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-3 col-form-label"
                        >
                          New Box Number
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter New Box Number"
                            value={newBoxNumber}
                            onChange={(e) => setNewBoxNumber(e.target.value)}
                          />
                          {!newBoxNumber && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-3 col-form-label"
                        >
                          New Rack Number
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Rack Number"
                            value={newRackNumber}
                            onChange={(e) => setNewRackNumber(e.target.value)}
                          />
                          {!newRackNumber && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-3 col-form-label"
                        >
                          New Shelf Number
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Shelf Number"
                            value={newSelfNumber}
                            onChange={(e) => setNewSelfNumber(e.target.value)}
                          />
                          {!newSelfNumber && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-3 col-form-label"
                        >
                          New Floor Number
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Floor Number"
                            value={newFloorNumber}
                            onChange={(e) => setNewFloorNumber(e.target.value)}
                          />
                          {!newFloorNumber && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      type="button"
                      color="success"
                      onClick={handleAddFileSubmit}
                      className="waves-effect waves-light"
                    >
                      Confirm
                    </Button>{" "}
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => setShowSplitModal(false)}
                      className="waves-effect waves-light"
                    >
                      Close
                    </Button>{" "}
                  </Modal.Footer>
                </Modal>

                {/* <Row className="mb-3">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label"
                >
                  CSA Number
                </label>
                <div className="col-md-10">
                  <Select
                    value={selectedCSA}
                    onChange={handleSelectCSA}
                    options={CSAData}
                    getOptionLabel={(option) => option?.CSA}
                    getOptionValue={(option) => option?.id?.toString()} // Convert to string if classId is a number
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Row> */}
                {/* <Row className="mb-3">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label"
                >
                  Date of Application
                </label>
                <div className="col-md-10">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Enter Date of Application"
                    value={date}
                    style={{ color: "black" }}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {!date && (
                    <span style={{ color: "red", display: spanDisplay }}>
                      This feild is required
                    </span>
                  )}
                </div>
              </Row>
              <div className="functions mt-2 d-flex justify-content-end">
                <Button
                  className=""
                  color="success"
                  type="button"
                  onClick={handleFetchDetail}
                >
                  Fetch Details
                </Button>
              </div> */}
              </CardHeader>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SplitWarehouse;
