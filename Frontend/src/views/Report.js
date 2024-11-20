/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
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

import { Modal } from "react-bootstrap";
import NormalHeader from "components/Headers/NormalHeader";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getReportData } from "helper/fileData_helper";
import { TreeGridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, Page, Toolbar } from '@syncfusion/ej2-react-treegrid';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import PropertyPane from "components/Report/PropertyPane";
import Loader from "components/Loader/Loader";
import { EXPORT_REPORT_DATA } from "helper/url_helper";
import { DUMP_DATABASE } from "helper/url_helper";
import axios from "axios";
import { url2 } from "helper/url_helper";

let sampleData = [
    {
        taskID: 1,
        taskName: 'Planning',
        startDate: new Date('02/03/2017'),
        endDate: new Date('02/07/2017'),
        progress: 100,
        duration: 5,
        priority: 'Normal',
        approved: false,
        subtasks: [
            {
                taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false
            },
            {
                taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Low', approved: true
            },
            {
                taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'),
                endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false
            },
            {
                taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'),
                endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true
            }
        ]
    },
    {
        taskID: 6,
        taskName: 'Design',
        startDate: new Date('02/10/2017'),
        endDate: new Date('02/14/2017'),
        duration: 3,
        progress: 86,
        priority: 'High',
        approved: false,
        subtasks: [
            {
                taskID: 7, taskName: 'Software Specification', startDate: new Date('02/10/2017'),
                endDate: new Date('02/12/2017'), duration: 3, progress: 60, priority: 'Normal', approved: false
            },
            {
                taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2017'),
                endDate: new Date('02/12/2017'), duration: 3, progress: 100, priority: 'Critical', approved: false
            },
            {
                taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2017'),
                endDate: new Date('02/14/2017'), duration: 2, progress: 100, priority: 'Low', approved: true
            },
            {
                taskID: 10, taskName: 'Design Documentation', startDate: new Date('02/13/2017'),
                endDate: new Date('02/14/2017'), duration: 2, progress: 100, priority: 'High', approved: true
            },
            {
                taskID: 11, taskName: 'Design complete', startDate: new Date('02/14/2017'),
                endDate: new Date('02/14/2017'), duration: 0, progress: 0, priority: 'Normal', approved: true
            }
        ]
    },
    {
        taskID: 12,
        taskName: 'Implementation Phase',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'Normal',
        approved: false,
        duration: 11,
        progress: 66,
        subtasks: [
            {
                taskID: 13,
                taskName: 'Phase 1',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/27/2017'),
                priority: 'High',
                approved: false,
                progress: 50,
                duration: 11,
                subtasks: [{
                    taskID: 14,
                    taskName: 'Implementation Module 1',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'Normal',
                    duration: 11,
                    progress: 10,
                    approved: false,
                    subtasks: [
                        {
                            taskID: 15, taskName: 'Development Task 1', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'High', approved: false
                        },
                        {
                            taskID: 16, taskName: 'Development Task 2', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Low', approved: true
                        },
                        {
                            taskID: 17, taskName: 'Testing', startDate: new Date('02/20/2017'),
                            endDate: new Date('02/21/2017'), duration: 2, progress: '0', priority: 'Normal', approved: true
                        },
                        {
                            taskID: 18, taskName: 'Bug fix', startDate: new Date('02/24/2017'),
                            endDate: new Date('02/25/2017'), duration: 2, progress: '0', priority: 'Critical', approved: false
                        },
                        {
                            taskID: 19, taskName: 'Customer review meeting', startDate: new Date('02/26/2017'),
                            endDate: new Date('02/27/2017'), duration: 2, progress: '0', priority: 'High', approved: false
                        },
                        {
                            taskID: 20, taskName: 'Phase 1 complete', startDate: new Date('02/27/2017'),
                            endDate: new Date('02/27/2017'), duration: 0, progress: '50', priority: 'Low', approved: true
                        }
                    ]
                }]
            },
            {
                taskID: 21,
                taskName: 'Phase 2',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/28/2017'),
                priority: 'High',
                approved: false,
                duration: 12,
                progress: 60,
                subtasks: [{
                    taskID: 22,
                    taskName: 'Implementation Module 2',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/28/2017'),
                    priority: 'Critical',
                    approved: false,
                    duration: 12,
                    progress: 90,
                    subtasks: [
                        {
                            taskID: 23, taskName: 'Development Task 1', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/20/2017'), duration: 4, progress: '50', priority: 'Normal', approved: true
                        },
                        {
                            taskID: 24, taskName: 'Development Task 2', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/20/2017'), duration: 4, progress: '50', priority: 'Critical', approved: true
                        },
                        {
                            taskID: 25, taskName: 'Testing', startDate: new Date('02/21/2017'),
                            endDate: new Date('02/24/2017'), duration: 2, progress: '0', priority: 'High', approved: false
                        },
                        {
                            taskID: 26, taskName: 'Bug fix', startDate: new Date('02/25/2017'),
                            endDate: new Date('02/26/2017'), duration: 2, progress: '0', priority: 'Low', approved: false
                        },
                        {
                            taskID: 27, taskName: 'Customer review meeting', startDate: new Date('02/27/2017'),
                            endDate: new Date('02/28/2017'), duration: 2, progress: '0', priority: 'Critical', approved: true
                        },
                        {
                            taskID: 28, taskName: 'Phase 2 complete', startDate: new Date('02/28/2017'),
                            endDate: new Date('02/28/2017'), duration: 0, progress: '50', priority: 'Normal', approved: false
                        }
                    ]
                }]
            },
            {
                taskID: 29,
                taskName: 'Phase 3',
                startDate: new Date('02/17/2017'),
                endDate: new Date('02/27/2017'),
                priority: 'Normal',
                approved: false,
                duration: 11,
                progress: 30,
                subtasks: [{
                    taskID: 30,
                    taskName: 'Implementation Module 3',
                    startDate: new Date('02/17/2017'),
                    endDate: new Date('02/27/2017'),
                    priority: 'High',
                    approved: false,
                    duration: 11,
                    progress: 60,
                    subtasks: [
                        {
                            taskID: 31, taskName: 'Development Task 1', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Low', approved: true
                        },
                        {
                            taskID: 32, taskName: 'Development Task 2', startDate: new Date('02/17/2017'),
                            endDate: new Date('02/19/2017'), duration: 3, progress: '50', priority: 'Normal', approved: false
                        },
                        {
                            taskID: 33, taskName: 'Testing', startDate: new Date('02/20/2017'),
                            endDate: new Date('02/21/2017'), duration: 2, progress: '0', priority: 'Critical', approved: true
                        },
                        {
                            taskID: 34, taskName: 'Bug fix', startDate: new Date('02/24/2017'),
                            endDate: new Date('02/25/2017'), duration: 2, progress: '0', priority: 'High', approved: false
                        },
                        {
                            taskID: 35, taskName: 'Customer review meeting', startDate: new Date('02/26/2017'),
                            endDate: new Date('02/27/2017'), duration: 2, progress: '0', priority: 'Normal', approved: true
                        },
                        {
                            taskID: 36, taskName: 'Phase 3 complete', startDate: new Date('02/27/2017'),
                            endDate: new Date('02/27/2017'), duration: 0, progress: '50', priority: 'Critical', approved: false
                        },
                    ]
                }]
            }
        ]
    }
];
const Report = () => {
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false)
    const [downloadReportDataModal, setDowloadReportDataModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [spanDisplay, setSpanDisplay] = useState("none");

    const fetchReportData = async () => {
        try {
            const data = await getReportData();
            if (data?.success) {
                setReportData(data?.result);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    useEffect(() => {
        fetchReportData();

    }, []);


    const treegridInstance = useRef(null);
    const modes = [
        { text: "Parent", value: "Parent" },
        { text: "Child", value: "Child" },
        { text: "Both", value: "Both" },
        { text: "None", value: "None" },
    ];

    const onChange = (sel) => {
        let mode = sel.value.toString();
        treegridInstance.current.search("");
        treegridInstance.current.searchSettings.hierarchyMode = mode;
    };

    const toolbarOptions = ["Search"];

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Return an empty string if dateString is undefined or null
        const date = new Date(dateString);
        if (isNaN(date)) return ''; // Return an empty string if the date is invalid
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDownloadReportFile = async () => {
        try {
            if (!startDate || !endDate) {
                setSpanDisplay("inline");
            }
            else {
                const response = await fetch(EXPORT_REPORT_DATA, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ startDate, endDate })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Report_Data_' + startDate + "_To_" + endDate;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setStartDate("")
                    setEndDate("")
                    setDowloadReportDataModal(false)
                } else {
                    console.error('Error generating Excel file');
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }


    const handleDownload = async () => {
        try {
            setLoader(true);
            // Make a GET request to the backend to get the dump file

            const response = await axios({
                url: DUMP_DATABASE, // Adjust to your backend API URL
                method: 'GET',
                responseType: 'blob', // Important for downloading files
            });

            // Create a URL for the blob object
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'database_dump.sql'); // Filename for download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
        } catch (error) {
            console.error('Error downloading the database dump:', error);
            toast.error('Error downloading the database dump');
        } finally {
            setLoader(false);
        }
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
                            {/* Table */}
                            <CardHeader className="border-0">

                                <div className="d-flex justify-content-between mb-2">
                                    <h3 className="mt-2">Report Data</h3>
                                    <div className="d-flex">

                                        <Button className="" color="primary" type="button" onClick={handleDownload}>
                                            Create Dump Mysql Data
                                        </Button>
                                        <Button className="" color="primary" type="button" onClick={() => setDowloadReportDataModal(true)}>
                                            Download Data
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <Row>



                                <div className="control-pane w-100 d-flex justify-content-center">
                                    <div className="control-section w-100">
                                        <div className="col-md-12 w-100">
                                            <TreeGridComponent
                                                dataSource={reportData}
                                                ref={treegridInstance}
                                                treeColumnIndex={0}  // The index of the column that will be used for hierarchical data
                                                childMapping="subData"  // Map the child data field
                                                height="600"
                                                allowPaging={true}
                                                toolbar={toolbarOptions}
                                                style={{ width: '100%' }}
                                                className="table table-bordered table-striped" // Bootstrap table classes
                                                pageSettings={{ pageSize: 40 }}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="Date"
                                                        headerText="Date"
                                                        width="400"
                                                        textAlign="center"
                                                        template={(data) => formatDate(data.Date)}
                                                    />
                                                    <ColumnDirective
                                                        field="collectionPoint"
                                                        headerText="Collection Point"
                                                        width="400"
                                                        textAlign="center"
                                                    />
                                                    <ColumnDirective
                                                        field="files"
                                                        headerText="Files"
                                                        width="400"
                                                        textAlign="center"
                                                    />
                                                    <ColumnDirective
                                                        field="totalPages"
                                                        headerText="Total Pages"
                                                        width="400"
                                                        textAlign="center"
                                                    />

                                                </ColumnsDirective>
                                                <Inject services={[Filter, Page, Toolbar]} />
                                            </TreeGridComponent>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                        </Card>
                    </div>
                </Row>
            </Container >

            {/* Modal for Download Data  */}
            <Modal
                show={downloadReportDataModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Download Data File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Select Start Date
                        </label>
                        <div className="col-md-10">
                            <input type="date"
                                className='form-control'
                                placeholder="Select Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                            {!startDate && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Select End Date
                        </label>
                        <div className="col-md-10">
                            <input type="date"
                                className='form-control'
                                placeholder="Select End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                            {!endDate && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setDowloadReportDataModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleDownloadReportFile} className="waves-effect waves-light">Download</Button>{" "}

                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Report;
