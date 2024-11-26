
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
import Select from "react-select"
import { fetchAllUsers } from "helper/userManagment_helper";
import { toast } from "react-toastify";
import { addFiletoWarehouse } from "helper/warehouse_helper";
import { getAllBarcodes } from "helper/barcode_helper";
import { issueFile } from "helper/warehouse_helper";
import { returnFile } from "helper/warehouse_helper";
import { getFileDataFromBarcode } from "helper/warehouse_helper";
import { getAllFilesData } from "helper/fileData_helper";
import { getDetail } from "helper/maintainance_helper";
import { deleteDirectory } from "helper/maintainance_helper";
import { deletePdf } from "helper/maintainance_helper";
import Loader from "components/Loader/Loader";
import { getFileFromBarcode } from "helper/fileData_helper";

const Maintainance = () => {
    const [selectedCSA, setSelectedCSA] = useState("");
    const [modal, setModal] = useState(false);
    const [date, setDate] = useState("");
    const [loader, setLoader] = useState(false);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [CSAData, setCSAData] = useState([]);
    const [selectedBarcode, setSelectedBarcode] = useState("");
    const [fileNames, setFileNames] = useState([]);

    const handleFileSelectFromBarcode = async (barcode) => {
        try {
            const data = await getFileFromBarcode({ barcode });
            if (data?.success) {
                if (data?.data != null) {
                    setCSAData([data?.data]);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    // const getAllFiles = async () => {
    //     try {
    //         const data = await getAllFilesData();
    //         if (data?.success) {
    //             setCSAData(data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong");
    //     }
    // }
    // useEffect(() => {
    //     getAllFiles();

    // }, []);


    const handleBarcodeInputChange = inputValue => {
        handleFileSelectFromBarcode(inputValue);
    }

    const handleSelectCSA = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
    };

    const handleBarcodeChange = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
    }

    const handleAddFileSubmit = async () => {
        if (selectedCSA == "") {
            toast.error("Kindly Select the CSA Number")
        }
        else {
            try {
                setModal(true);
                // const data = await addFiletoWarehouse({ selectedCSA })
                // if (data?.success) {
                //     toast.success(data?.message);
                // }
                // else {
                //     toast.error(data?.message)
                // }
            } catch (error) {
                console.log(error);
                toast.error("something went wrong");
            }
        }
    }

    const handleFetchDetail = async () => {
        try {
            const csa = selectedCSA?.CSA;
            setLoader(true)
            const data = await getDetail({ csa, date });
            setLoader(false)
            if (data?.success) {
                setFileNames(data.pdfFiles);
                setModal(true);
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    const handleDeleteDirectory = async () => {
        try {
            const csa = selectedCSA?.CSA;
            setLoader(true)
            const data = await deleteDirectory({ csa, date });
            setLoader(false)
            if (data?.success) {
                toast.success(data?.message);
                setModal(false);
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const handleDeletePdf = async () => {
        console.log(selectedFiles)

        try {
            const csa = selectedCSA?.CSA;
            const pdfNames = selectedFiles;
            setLoader(true)
            const data = await deletePdf({ csa, date, pdfNames });
            setLoader(false)
            if (data?.success) {
                toast.success(data?.message);
                // Filter out the selected files from fileNames
                setFileNames((prevFileNames) => prevFileNames.filter((file) => !selectedFiles.includes(file)));

                // Clear selected files
                setSelectedFiles([]);
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSelect = (fileName) => {
        setSelectedFiles((prevSelectedFiles) => {
            if (prevSelectedFiles.includes(fileName)) {
                return prevSelectedFiles.filter((file) => file !== fileName);
            } else {
                return [...prevSelectedFiles, fileName];
            }
        });
    };


    return (
        <>
            <NormalHeader />
            <Container className="mt--7" fluid>
                {loader ? (
                    <Loader />
                ) : ("")}
                <Row>

                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h1 className="mt-2">Maintainance Section</h1>
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
                                            getOptionLabel={option => option?.barcode}
                                            getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                         placeholder="Enter barcode to search"
                                       />
                                        {!selectedBarcode && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
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
                                            options={CSAData}
                                            getOptionLabel={option => option?.CSA}
                                            getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Date of Application
                                    </label>
                                    <div className="col-md-10">
                                        <input type="date"
                                            className='form-control'
                                            placeholder="Enter Date of Application"
                                            value={date}
                                            style={{ color: "black" }}
                                            onChange={(e) => setDate(e.target.value)} />
                                        {!date && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                                <div className="functions mt-2 d-flex justify-content-end">

                                    <Button className="" color="success" type="button" onClick={handleFetchDetail}>
                                        Fetch Details
                                    </Button>
                                </div>


                            </CardHeader>

                        </Card>
                    </div>
                </Row>

            </Container>
            {/* Modal for add the file  */}
            <Modal
                show={modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <div className="d-flex justify-content-between w-100">
                        <Modal.Title id="contained-modal-title-vcenter">

                            <h1>All Tagging Documents</h1>

                        </Modal.Title>
                        <Button type="button" color="warning" className="waves-effect waves-light mt-2" onClick={handleDeleteDirectory}>
                            Delete Directory
                        </Button>

                    </div>
                </Modal.Header>
                <Modal.Body>

                    <div>
                        {fileNames?.map((d, i) => (
                            <div key={i} className="d-flex">
                                <input
                                    type="checkbox"
                                    checked={selectedFiles.includes(d)}
                                    onChange={() => handleSelect(d)}
                                />
                                <h4 className="ml-3">{d}</h4>
                            </div>
                        ))}
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="warning" className="waves-effect waves-light" onClick={handleDeletePdf}>Delete</Button>{" "}
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default Maintainance;
