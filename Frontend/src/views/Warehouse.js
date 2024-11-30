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
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchAllUsers } from "helper/userManagment_helper";
import { toast } from "react-toastify";
import { addFiletoWarehouse } from "helper/warehouse_helper";
import { getAllBarcodes } from "helper/barcode_helper";
import { issueFile } from "helper/warehouse_helper";
import { returnFile } from "helper/warehouse_helper";
import { getFileDataFromBarcode } from "helper/warehouse_helper";
import { getAllFilesData } from "helper/fileData_helper";
import { getWarehousingRecord } from "helper/warehouse_helper";
import Loader from "components/Loader/Loader";
import { getFileFromCSA } from "helper/fileData_helper";
import { getFileFromBarcode } from "helper/fileData_helper";

const Warehouse = () => {
  const [selectedCSA, setSelectedCSA] = useState("");
  const [addFileModal, setAddFileModal] = useState(false);
  const [issueFileModal, setIssueFileModal] = useState(false);
  const [returnFileModal, setReturnFileModal] = useState(false);
  const [boxNumber, setBoxNumber] = useState("");
  const [shelfNumber, setShelfNumber] = useState("");
  const [rackNumber, setRackNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("1");
  const [fileIssueReason, setFileIssueReason] = useState("");
  const [fileIssueTo, setFileIssueTo] = useState("");
  const [loader, setLoader] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [spanDisplay, setSpanDisplay] = useState("none");
  const [CSAData, setCSAData] = useState([]);
  const [fileData, setFileData] = useState({});
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [issueTo, setIssueTo] = useState("");
  const [csaOldRecord, setCsaOldRecord] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await fetchAllUsers();
      if (data?.success) {
        setAllUsers(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const getAllFiles = async () => {
    try {
      const data = await getAllFilesData();
      if (data?.success) {
        setCSAData(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const num = +selectedBarcode.barcode + 1
        const str = (num).toString();
        console.log(str);
        const data = await getFileFromBarcode({ barcode: str });
        console.log(data);
        if (data?.success) {
          if (data?.data !== null) {
            setCSAData([data?.data]);
            setSelectedCSA(data?.data);
            setSelectedBarcode(data?.data);
          }else{
            toast.warning("No data available for next barcode")
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
      // const res= await  handleFileSelectFromBarcode();
      // console.log(res)
    };
    console.log(selectedCSA);
    const handleKeyDown = (event) => {
      // Check if Shift and N are pressed
      if (event.altKey && event.key === "s") {
        if (selectedBarcode.length !== 0) {
          console.log("barcode selected");
          console.log(+selectedBarcode.barcode + 1);
          loadData();
        } else {
         
          console.log("no barcode selected");
        }
      }
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBarcode]);
  useEffect(() => {
    // fetchUsers();
    // getAllFiles();
  }, []);

  const getFileData = async (selectedCSA) => {
    try {
      setLoader(true);
      const data = await getFileDataFromBarcode({ selectedCSA });
      setLoader(false);
      if (data?.success) {
        setFileData(data?.file);
      } else {
        setFileData(null);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const getOldDataWithSameCsa = async (selectedCSA) => {
    try {
      setLoader(true);
      const data = await getWarehousingRecord({ CSA: selectedCSA?.CSA });
      setLoader(false);
      if (data?.success) {
        setCsaOldRecord(data?.result);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSelectCSA = (selectedOption) => {
    setSelectedBarcode(selectedOption);
    setSelectedCSA(selectedOption);
    getFileData(selectedOption);
    getOldDataWithSameCsa(selectedOption);

    setCsaOldRecord(null);
    setFileData(null);
  };

  const handleCSAInputChange = (inputValue) => {
    handleFileSelectFromCSA(inputValue);
  };

  const handleBarcodeChange = (selectedOption) => {
    setSelectedBarcode(selectedOption);
    setSelectedCSA(selectedOption);
    getFileData(selectedOption);
    getOldDataWithSameCsa(selectedOption);

    setCsaOldRecord(null);
    setFileData(null);
  };
  const handleBarcodeInputChange = (inputValue) => {
    handleFileSelectFromBarcode(inputValue);
  };
  const handleSelectUser = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleAddFile = () => {
    if (selectedCSA == "") {
      toast.error("Kindly Select the CSA Number");
    } else if (fileData) {
      toast.error("Warehousing is already done of this file");
    } else {
      if (csaOldRecord.length > 0) {
        setBoxNumber(csaOldRecord[0]?.boxNumber);
        setShelfNumber(csaOldRecord[0]?.shelfNumber);
        setRackNumber(csaOldRecord[0]?.rackNumber);
        setFloorNumber(csaOldRecord[0]?.floorNumber);
        toast.success("File with this CSA already exists");
      }
      setAddFileModal(true);
    }
  };
  const handleIssueFile = () => {
    if (selectedCSA == "") {
      toast.error("Kindly Select the CSA Number");
    } else {
      if (fileData) {
        setBoxNumber(fileData?.boxNumber);
        setShelfNumber(fileData?.shelfNumber);
        setRackNumber(fileData?.rackNumber);
        setFloorNumber(fileData?.floorNumber);
        setIssueFileModal(true);
      } else {
        toast.error("Warehousing is not done of this file");
      }
    }
  };

  const handleReturnFile = () => {
    if (selectedCSA == "") {
      toast.error("Kindly Select the CSA Number");
    } else {
      if (fileData) {
        setBoxNumber(fileData?.boxNumber);
        setShelfNumber(fileData?.shelfNumber);
        setRackNumber(fileData?.rackNumber);
        setFloorNumber(fileData?.floorNumber);
        setReturnFileModal(true);
      } else {
        toast.error("Warehousing is not done of this file");
      }
    }
  };

  const handleAddFileSubmit = async () => {
    // Temporary variables to hold the validated values
    let validatedShelfNumber = shelfNumber;
    let validatedRackNumber = rackNumber;
    let validatedFloorNumber = floorNumber;

    if (!shelfNumber) {
      validatedShelfNumber = "0";
    }
    if (!rackNumber) {
      validatedRackNumber = "0";
    }
    if (!floorNumber) {
      validatedFloorNumber = "0";
    }

    // Check if boxNumber is present
    if (!boxNumber) {
      setSpanDisplay("inline");
      return;
    }

    // Update state with validated values before making the API call
    // setShelfNumber(validatedShelfNumber);
    // setRackNumber(validatedRackNumber);
    // setFloorNumber(validatedFloorNumber);

    // Proceed with the API call
    try {
      setLoader(true);
      const data = await addFiletoWarehouse({
        boxNumber,
        shelfNumber: validatedShelfNumber,
        rackNumber: validatedRackNumber,
        floorNumber: validatedFloorNumber,
        selectedCSA,
      });
      setLoader(false);
      if (data?.success) {
        toast.success(data?.message);
        setAddFileModal(false);
        // Reset state values only if the API call is successful
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error occurred while adding file to warehouse:", error);
      toast.error("Something went wrong");
    }
  };

  const handleIssueFileSubmit = async () => {
    if (!fileIssueReason || !issueTo) {
      setSpanDisplay("inline");
    } else {
      try {
        setLoader(true);
        const data = await issueFile({ fileIssueReason, issueTo, selectedCSA });
        setLoader(false);
        if (data?.success) {
          toast.success(data?.message);
          setIssueFileModal(false);
          setFileIssueReason("");
          setSelectedUser("");
          setSelectedCSA("");
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
        toast.error("something went wrong");
      }
    }
  };

  const handleReturnFileSubmit = async () => {
    let validatedShelfNumber = shelfNumber;
    let validatedRackNumber = rackNumber;
    let validatedFloorNumber = floorNumber;

    if (!shelfNumber) {
      validatedShelfNumber = "0";
    }
    if (!rackNumber) {
      validatedRackNumber = "0";
    }
    if (!floorNumber) {
      validatedFloorNumber = "0";
    }

    // Check if boxNumber is present
    if (!boxNumber) {
      setSpanDisplay("inline");
      return;
    }

    // Update state with validated values before making the API call
    setShelfNumber(validatedShelfNumber);
    setRackNumber(validatedRackNumber);
    try {
      setLoader(true);
      const data = await returnFile({
        boxNumber,
        shelfNumber,
        rackNumber,
        floorNumber,
        selectedCSA,
      });
      setLoader(false);
      if (data?.success) {
        toast.success(data?.message);
        setReturnFileModal(false);
        setBoxNumber("");
        setShelfNumber("");
        setRackNumber("");
        setSelectedCSA("");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const customFilterOption = (option, searchInput) => {
    if (!searchInput) return true; // Show all options when search input is empty

    const searchTerm = searchInput.toLowerCase();
    const optionValue = option.data.barcode.toLowerCase();

    // Prioritize options that start with the search term, followed by others
    return optionValue.startsWith(searchTerm);
  };

  const handleFileSelectFromCSA = async (csa) => {
    try {
      const data = await getFileFromCSA({ CSA: csa });
      if (data?.success) {
        if (data?.data != null) {
          setCSAData([data?.data]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleFileSelectFromBarcode = async (barcode) => {
    try {
      const data = await getFileFromBarcode({ barcode });
      console.log(data);
      if (data?.success) {
        if (data?.data != null) {
          setCSAData([data?.data]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        {loader ? <Loader /> : ""}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h1 className="mt-2">Warehouse Section</h1>
                </div>
                <Row className="mb-3">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                  >
                    Barcode
                  </label>
                  <div className="col-md-10">
                    <Select
                      value={selectedBarcode}
                      onChange={handleBarcodeChange}
                      onInputChange={handleBarcodeInputChange}
                      options={CSAData}
                      // options={
                      //   CSAData.sort((a, b) =>
                      //     a.barcode.localeCompare(b.barcode)
                      //   ) // Sort options in ascending order
                      // }
                      // filterOption={customFilterOption} // Custom filter for sorting by search input
                      getOptionLabel={(option) => option?.barcode}
                      getOptionValue={(option) => option?.id?.toString()} // Convert to string if id is a number
                      classNamePrefix="select2-selection"
                      placeholder="Enter barcode to search"
                    />

                    {!selectedBarcode && (
                      <span style={{ color: "red", display: spanDisplay }}>
                        This feild is required
                      </span>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
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
                      onInputChange={handleCSAInputChange}
                      options={CSAData}
                      getOptionLabel={(option) => option?.CSA}
                      getOptionValue={(option) => option?.id?.toString()} // Convert to string if classId is a number
                      classNamePrefix="select2-selection"
                      placeholder="Search barcode to get CSA"
                    />
                  </div>
                </Row>
                <div className="functions mt-2 d-flex justify-content-end">
                  <Button
                    className=""
                    color="success"
                    type="button"
                    onClick={handleAddFile}
                  >
                    Add File
                  </Button>
                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={handleIssueFile}
                  >
                    Issue File
                  </Button>
                  <Button
                    className=""
                    color="info"
                    type="button"
                    onClick={handleReturnFile}
                  >
                    Return File
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </Row>
      </Container>
      {/* Modal for add the file  */}
      <Modal
        show={addFileModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Add File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {csaOldRecord && (
            <>
              <h1>
                {csaOldRecord?.length} File of this costumer is already exists
                in warehouse
              </h1>

              {csaOldRecord.map((d, i) => (
                <>
                  <div className="m-4">
                    <b>{i + 1}.</b>
                    <div className="mx-3">
                      <h4>Barcode: {d?.barcode}</h4>
                      <h4>Type of Application: {d?.typeOfApplication}</h4>
                      <h4>Date of Application: {d?.dateOfApplication}</h4>
                    </div>
                  </div>
                </>
              ))}
            </>
          )}

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Box Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
              />
              {!boxNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Rack Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={rackNumber}
                onChange={(e) => setRackNumber(e.target.value)}
              />
              {!rackNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Shelf Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={shelfNumber}
                onChange={(e) => setShelfNumber(e.target.value)}
              />
              {!shelfNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Floor Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Floor Number"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                readOnly={true}
              />
              {!floorNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="success"
            onClick={handleAddFileSubmit}
            className="waves-effect waves-light"
          >
            Add
          </Button>{" "}
          <Button
            type="button"
            color="primary"
            onClick={() => setAddFileModal(false)}
            className="waves-effect waves-light"
          >
            Close
          </Button>{" "}
        </Modal.Footer>
      </Modal>

      {/* Modal for Issue the file  */}
      <Modal
        show={issueFileModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Issue File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Reason
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Reason for Issuance of the File"
                value={fileIssueReason}
                onChange={(e) => setFileIssueReason(e.target.value)}
              />
              {!fileIssueReason && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Select Issue To
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Issue to"
                value={issueTo}
                onChange={(e) => setIssueTo(e.target.value)}
              />
              {!issueTo && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <div className="m-auto">
            <h1>File Data</h1>
            <h4>Box No: {fileData?.boxNumber}</h4>
            <h4>Rack No: {fileData?.rackNumber}</h4>
            <h4>Shelf No: {fileData?.shelfNumber}</h4>
            <h4>Floor No: {fileData?.floorNumber}</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="primary"
            onClick={() => setIssueFileModal(false)}
            className="waves-effect waves-light"
          >
            Close
          </Button>{" "}
          <Button
            type="button"
            color="success"
            onClick={handleIssueFileSubmit}
            className="waves-effect waves-light"
          >
            Issue
          </Button>{" "}
        </Modal.Footer>
      </Modal>

      {/* Modal for Return the file  */}
      <Modal
        show={returnFileModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Return File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Box Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
              />
              {!boxNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Shelf Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={shelfNumber}
                onChange={(e) => setShelfNumber(e.target.value)}
              />
              {!shelfNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Rack Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Box File Number"
                value={rackNumber}
                onChange={(e) => setRackNumber(e.target.value)}
              />
              {!rackNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Floor Number
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Floor Number"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                readOnly={true}
              />
              {!floorNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="primary"
            onClick={() => setReturnFileModal(false)}
            className="waves-effect waves-light"
          >
            Close
          </Button>{" "}
          <Button
            type="button"
            color="success"
            onClick={handleReturnFileSubmit}
            className="waves-effect waves-light"
          >
            Return
          </Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Warehouse;
