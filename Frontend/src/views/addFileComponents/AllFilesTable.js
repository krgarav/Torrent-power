import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { format, setDate } from "date-fns";
import Select from "react-select";
import { toast } from "react-toastify";
import { getFilterFilesData } from "helper/fileData_helper";
import { getFileDetailData } from "helper/fileData_helper";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Toolbar,
  Sort,
  Inject,
  Filter,
  Scroll,
} from "@syncfusion/ej2-react-grids";
import axios from "axios";
import { GET_SEARCH_FILE_DATA } from "helper/url_helper";
const AllFilesTable = ({
  setCurrentPage,
  pageSize,
  totalRecords,
  currentPage,
  handlePageChange,
  typeOfRequestData,
  setSelectedFileId,
  collectionPointData,
  setCSANumber,
  setTypeOfRequest,
  setNoOfPages,
  setDateOfApplication,
  setBarcode,
  setCollectionPoint,
  files,
  setFiles,
  setLoader,
  setModalShow,
  setFileDetailData,
  setAllFilesDisplay,
  setDownloadModal,
  setUpdateModal,
}) => {
  const [selectedDays, setSelectedDays] = useState("");
  const [filterFiles, setFilterFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [pageSize1] = useState(10);
  const [totalRecords1, setTotalRecords1] = useState(0);
  const [search, setSearch] = useState("");

  const filterSettings = { type: "Excel" };
  const toolbarOptions = ["Search"];

  const daysData = [
    { id: 1, name: "One Day", value: 1 },
    { id: 2, name: "One Week", value: 7 },
    { id: 3, name: "One Month", value: 30 },
    { id: 4, name: "Six Month", value: 180 },
    { id: 5, name: "One Year", value: 365 },
    { id: 6, name: "default", value: 0 },
  ];

  const fetchFilterFiles = async (days) => {
    try {
      const data = await getFilterFilesData({ days });
      if (data?.success) {
        setFilterFiles(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const handleDateChange = (selectedOption) => {
    setSelectedDays(selectedOption);
    if (selectedOption.id == 6) {
      setFilterFiles([]);
    } else {
      fetchFilterFiles(selectedOption.value);
    }
  };

  const handleRowClick = async (d) => {
    try {
      const fileDataId = d.id;
      setLoader(true);
      const data = await getFileDetailData({ fileDataId });
      setLoader(false);
      if (data?.success) {
        console.log(data.result);
        setFileDetailData({
          fileData: d,
          tagging: data?.result?.tagging,
          warehouse: data?.result?.warehouse,
        });
        setModalShow(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEditRowClick = async (d) => {
    try {
      setSelectedFileId(d.id);
      setUpdateModal(true);
      setCSANumber(d?.CSA);
      setBarcode(d?.barcode);
      typeOfRequestData.forEach((data) => {
        if (data.name.toLowerCase() === d?.typeOfRequest.toLowerCase()) {
          setTypeOfRequest(data);
        }
      });
      setNoOfPages(d?.noOfPages);

      const dateStr = d.dateOfApplication;
      const date = new Date(dateStr);
      // Format the date as yyyy-mm-dd
      const formattedDate = date.toISOString().split("T")[0];
      setDateOfApplication(formattedDate);

      console.log("dateOfApplication ", d.dateOfApplication);
      collectionPointData.map((data) => {
        if (data.name == d.collectionPoint) {
          setCollectionPoint(data);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const dropdownTemplate = (props) => (
    <td className="text-right">
      <UncontrolledDropdown>
        <DropdownToggle
          className="btn-icon-only text-light"
          href="#pablo"
          role="button"
          size="sm"
          color=""
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-arrow" right>
          <DropdownItem href="#pablo" onClick={() => handleEditRowClick(props)}>
            Edit
          </DropdownItem>
          <DropdownItem href="#pablo" onClick={() => handleRowClick(props)}>
            View
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </td>
  );

  const dateTemplate = (props) => {
    const date = new Date(props.createdAt);
    return <span>{date.toLocaleDateString()}</span>;
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalRecords / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage1 = () => {
    if (currentPage1 < Math.ceil(totalRecords1 / pageSize1)) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  const handlePreviousPage1 = () => {
    if (currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
  };
  const fetchSearchFiles = async (pageNumber = 1, pageSize = 10) => {
    try {
      const { data } = await axios.get(GET_SEARCH_FILE_DATA, {
        params: { pageNumber, pageSize, search },
      });
      if (data?.success) {
        console.log(data?.data);
        setFiles1(data?.data);
        setTotalRecords1(data.totalRecords); // Store the total records for pagination
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchSearchFiles(currentPage1, pageSize1); // Fetch data on mount or when page/search changes
  }, [currentPage1]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <div className="d-flex justify-content-between ">
                <h3 className="mt-2">All Files</h3>
                <div className="d-flex justify-content-center">
              <input
                type="text"
                className="form-control w-58 "
                placeholder="Enter barcode to search.."
                value={search}
                onChange={handleSearchChange}
              />
              <Button
                className=""
                color="info"
                type="button"
                onClick={() => {
                  fetchSearchFiles(1, pageSize1);
                  setCurrentPage1(1);
                }}
              >
                Search
              </Button>
            </div>
                {/* <div className="">
                                    <Select

                                        value={selectedDays}
                                        onChange={handleDateChange}
                                        options={daysData}
                                        getOptionLabel={option => option?.name}
                                        getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                        classNamePrefix="select2-selection"
                                    />
                                </div> */}

                <div className="">
                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={() => setAllFilesDisplay(false)}
                  >
                    Add File
                  </Button>
                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={() => setDownloadModal(true)}
                  >
                    Download Data
                  </Button>
                </div>
              </div>
            </CardHeader>

            

            {search.length > 0 ? (
              <div className="table">
                <div className="control-pane">
                  <div className="control-section row justify-content-center"   style={{ height: "60vh", overflow: "hidden" }}>
                    <GridComponent
                      dataSource={files1}
                      width="100%"
                      height="100%"
                      // toolbar={toolbarOptions}
                      allowSorting={true}
                      // allowFiltering={true}
                      // allowPaging={true}
                      // filterSettings={filterSettings}
                      pageSettings={{ pageSize: 10, pageCount: 5 }} // Handle page change event
                      scrollSettings={{
                        enableVirtualization: true, // Enable scrolling with fixed header
                        height: "100%", // This makes the body scrollable while header stays fixed
                      }}
                    >
                      <ColumnsDirective>
                        <ColumnDirective
                          field="CSA"
                          headerText="CSA"
                          width="300"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="barcode"
                          headerText="Barcode"
                          width="300"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="typeOfRequest"
                          headerText="Type Of Request"
                          width="300"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="noOfPages"
                          headerText="No of Pages"
                          width="300"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="createdAt"
                          headerText="Created At"
                          width="300"
                          template={dateTemplate}
                        ></ColumnDirective>
                        <ColumnDirective
                          headerText="Actions"
                          width="150"
                          template={dropdownTemplate}
                          textAlign="Right"
                        />
                      </ColumnsDirective>
                      <Inject
                        services={[Toolbar, Page, Sort, Filter, Scroll]}
                      />
                    </GridComponent>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  {/* // here create the next and previous buttons for pagination */}
                  <button
                    onClick={handlePreviousPage1}
                    disabled={currentPage1 === 1}
                    className="btn btn-primary me-2"
                  >
                    Previous
                  </button>
                  <div className="mt-2 mr-2">
                    {" "}
                    <h3>
                      {" "}
                      Page {currentPage1} of{" "}
                      {Math.ceil(totalRecords1 / pageSize1)}{" "}
                    </h3>
                  </div>
                  <button
                    onClick={handleNextPage1}
                    disabled={
                      currentPage1 === Math.ceil(totalRecords1 / pageSize1)
                    }
                    className="btn btn-primary ms-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="table">
                <div className="control-pane">
                  <div
                    className="control-section row justify-content-center"
                    style={{ height: "60vh", overflow: "hidden" }}
                  >
                    {files.length > 0 && (
                      <GridComponent
                        dataSource={files}
                        width="100%"
                        height="100%"
                        // toolbar={toolbarOptions}
                        allowSorting={true}
                        // allowFiltering={true}
                        // allowPaging={true}
                        pageSettings={{
                          pageSize: pageSize,
                          pageCount: Math.ceil(totalRecords / pageSize), // Calculate the total number of pages
                          currentPage: currentPage,
                        }}
                        pageSettingsChange={handlePageChange} // Handle page change event
                        scrollSettings={{
                          enableVirtualization: true, // Enable scrolling with fixed header
                          height: "100%", // This makes the body scrollable while header stays fixed
                        }}
                      >
                        <ColumnsDirective>
                          <ColumnDirective
                            field="CSA"
                            headerText="CSA"
                            width="300"
                          ></ColumnDirective>
                          <ColumnDirective
                            field="barcode"
                            headerText="Barcode"
                            width="300"
                          ></ColumnDirective>
                          <ColumnDirective
                            field="typeOfRequest"
                            headerText="Type Of Request"
                            width="300"
                          ></ColumnDirective>
                          <ColumnDirective
                            field="noOfPages"
                            headerText="No of Pages"
                            width="300"
                          ></ColumnDirective>
                          <ColumnDirective
                            field="createdAt"
                            headerText="Created At"
                            width="300"
                            template={dateTemplate}
                          ></ColumnDirective>
                          <ColumnDirective
                            headerText="Actions"
                            width="150"
                            template={dropdownTemplate}
                            textAlign="Right"
                          />
                        </ColumnsDirective>
                        <Inject
                          services={[Toolbar, Page, Sort, Filter, Scroll]}
                        />
                      </GridComponent>
                    )}
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    {/* // here create the next and previous buttons for pagination */}
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="btn btn-primary me-2"
                    >
                      Previous
                    </button>
                    <div className="mt-2 mr-2">
                      {" "}
                      <h3>
                        {" "}
                        Page {currentPage} of{" "}
                        {Math.ceil(totalRecords / pageSize)}{" "}
                      </h3>
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage === Math.ceil(totalRecords / pageSize)
                      }
                      className="btn btn-primary ms-2"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Row>
    </>
  );
};

export default AllFilesTable;
