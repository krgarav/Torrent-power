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
    Card,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Table,
    Container,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal, Button, Nav, Form, Tab, Row, Col, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Select from "react-select"
import { useNavigate } from "react-router-dom";

const Template = () => {
    const [allTemplates, setAllTemplates] = useState([]);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [activeKey, setActiveKey] = useState('general');
    const [spanDisplay, setSpanDisplay] = useState("none");


    const [name, setName] = useState("")
    const [size, setSize] = useState({ id: 1, name: "A4" })
    const [longitude, setLongitude] = useState("210")
    const [layitude, setLayitude] = useState("297")
    const [numberOfLines, setNumberOfLines] = useState("48")
    const [timingMethod, setTimingMethod] = useState({ id: 1, name: "Mark to mark" })
    const [numberOfFrontSideColumn, setNumberOfFrontSideColumn] = useState("64")
    const [numberOfBackSideColumn, setNumberOfBackSideColumn] = useState("")
    const [typeOfColumnDisplay, setTypeOfColumnDisplay] = useState({ id: 4, name: "Type4" })
    const [sensivityDensivityDifference, setSensivityDensivityDifference] = useState({ id: 1, name: "Effictive the sensitivity of software setup" })

    const [errorOfTheNumberOfTimingMarks, setErrorOfTheNumberOfTimingMarks] = useState({ id: 2, name: "Check error, and stop the OMR" });
    const [suspendedWhenAnErrorIsDetectedInTheSkewMarksFrame, setSuspendedWhenAnErrorIsDetectedInTheSkewMarksFrame] = useState(true);
    const [suspendedWhenAnErrorIsDetectedInTheIdMarksFrame, setSuspendedWhenAnErrorIsDetectedInTheIdMarksFrame] = useState(true);
    const [suspendedWhenAnErrorIsDetectedInTheMarksFrame, setSuspendedWhenAnErrorIsDetectedInTheMarksFrame] = useState(true);
    const [outputTheDataWhenWarkErrorDetected, setOutputTheDataWhenMarkErrorDetected] = useState(false);
    const [useRejecter, setUseRejecter] = useState(false);
    const [editTheDataWhenMarkErrorDetected, setEditTheDataWhenMarkErrorDetected] = useState(false);

    const sizeData = [
        { id: 1, name: "A4" },
        { id: 2, name: "IBM Card" },
        { id: 3, name: "WIDE Card" },
        { id: 4, name: "B5" },
        { id: 5, name: "POST Card" },
        { id: 6, name: "Setting User" },
        { id: 7, name: "8.5" },
    ]

    const timingMethodData = [
        { id: 1, name: "Mark to mark" },
        { id: 2, name: "Direct under" },
        { id: 3, name: "Timing control(Standard : 3 times)" },
        { id: 4, name: "Timing control(Reduction : 2 times)" },
        { id: 5, name: "Timing control(Extension : 4 times)" },
    ]

    const typeOfColumnDisplayData = [
        { id: 1, name: "Type1" },
        { id: 2, name: "Type2" },
        { id: 3, name: "Type3" },
        { id: 4, name: "Type4" }
    ];

    const sensivityDensivityDifferenceData = [
        { id: 1, name: "Effictive the sensitivity of software setup" },
        { id: 2, name: "Effictive the sensitivity of OMR setup" }
    ];
    const errorOfTheNumberOfTimingMarksData = [
        { id: 1, name: "Not check error" },
        { id: 2, name: "Check error, and stop the OMR" },
        { id: 3, name: "Check error, and not stop the OMR" },
    ]

    const handleCreate = () => {

    }

    const [key, setKey] = useState('general');



    return (
        <>
            <NormalHeader />
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h3 className="mt-2">All Users</h3>
                                    {/* <Button className="" color="primary" type="button" onClick={() => navigate("/admin/design-template")}> */}
                                    <Button className="" color="primary" type="button" onClick={() => setModalShow(true)}>
                                        Create Template
                                    </Button>
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush mb-5" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Sno.</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Role</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody style={{ minHeight: "100rem" }}>
                                    {allTemplates?.map((d, i) => (
                                        <>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{d.name}</td>
                                                <td>
                                                    {d.email}
                                                </td>
                                                <td>
                                                    {d.phoneNumber}
                                                </td>
                                                <td>
                                                    {d?.userRoleList[0]?.roleName}
                                                </td>
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
                                                            <DropdownItem
                                                                href="#pablo"
                                                            >
                                                                Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                            >
                                                                Delete
                                                            </DropdownItem>

                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        </>
                                    ))}



                                </tbody>
                            </Table>

                        </Card>
                    </div>
                </Row>

            </Container>





            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="modal-custom-navbar"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="modal-custom-navbar">
                        Create Template
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                        <Row>
                            <Col sm={12}> {/* Adjusted column span to full width if needed */}
                                <Nav variant="pills" className="flex-row justify-content-center">
                                    <Nav.Item>
                                        <Nav.Link eventKey="general">General</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="sensitivity">Sensitivity</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="errors">Errors</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <Tab.Content>
                                    <Tab.Pane eventKey="general">
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-3 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Name:
                                            </label>
                                            <div className="col-md-9">
                                                <input type="text"
                                                    className='form-control'
                                                    placeholder="Enter User Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)} />
                                                {!name && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-3 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Size:
                                            </label>
                                            <div className="col-md-9">

                                                <Select
                                                    value={size}
                                                    onChange={(selectedValue) => setSize(selectedValue)}
                                                    options={sizeData}
                                                    getOptionLabel={option => option?.name || ""}
                                                    getOptionValue={option => option?.id?.toString() || ""}
                                                />
                                                {!size && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={4}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 col-form-label "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Longitude:
                                                    </label>
                                                    <div className="col-md-6 d-flex">
                                                        <input type="number"
                                                            className='form-control'
                                                            value={longitude}
                                                            onChange={(e) => setLongitude(e.target.value)} />
                                                        <p className="mt-3 ml-1 fw-bolder"> mm</p>
                                                        {!longitude && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                    </div>
                                                </Row>
                                            </Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 col-form-label"
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Layitude:
                                                    </label>
                                                    <div className="col-md-6 d-flex" >
                                                        <input type="number"
                                                            className='form-control'
                                                            value={layitude}
                                                            onChange={(e) => setLayitude(e.target.value)}
                                                        /><p className="mt-3 ml-1 fs-5"> mm</p>
                                                        {!layitude && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                    </div>
                                                </Row>
                                            </Col>
                                            <Col sm={4}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 col-form-label"
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Number of lines:
                                                    </label>
                                                    <div className="col-md-6">
                                                        <input type="number"
                                                            className='form-control'
                                                            value={numberOfLines}
                                                            onChange={(e) => setNumberOfLines(e.target.value)} />
                                                        {!numberOfLines && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                    </div>
                                                </Row>
                                            </Col>

                                        </Row>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-3 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Timing method:
                                            </label>
                                            <div className="col-md-9">

                                                <Select
                                                    value={timingMethod}
                                                    onChange={(selectedValue) => setTimingMethod(selectedValue)}
                                                    options={sizeData}
                                                    getOptionLabel={option => option?.name || ""}
                                                    getOptionValue={option => option?.id?.toString() || ""}
                                                />
                                                {!timingMethod && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={6}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Number of front side of column:
                                                    </label>
                                                    <div className="col-md-6">
                                                        <input type="number"
                                                            className='form-control'
                                                            value={numberOfFrontSideColumn}
                                                            onChange={(e) => setNumberOfFrontSideColumn(e.target.value)} />
                                                        {!numberOfFrontSideColumn && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                    </div>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-6 "
                                                        style={{ fontSize: ".9rem" }}
                                                    >
                                                        Number of back side column:
                                                    </label>
                                                    <div className="col-md-6">
                                                        <input type="number"
                                                            className='form-control'
                                                            value={numberOfBackSideColumn}
                                                            onChange={(e) => setNumberOfBackSideColumn(e.target.value)}
                                                        />
                                                        {!numberOfBackSideColumn && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                    </div>
                                                </Row>
                                            </Col>


                                        </Row>

                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-3 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Type of column display:
                                            </label>
                                            <div className="col-md-9">

                                                <Select
                                                    value={typeOfColumnDisplay}
                                                    onChange={(selectedValue) => setTypeOfColumnDisplay(selectedValue)}
                                                    options={typeOfColumnDisplayData}
                                                    getOptionLabel={option => option?.name || ""}
                                                    getOptionValue={option => option?.id?.toString() || ""}
                                                />
                                                {!typeOfColumnDisplay && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                            </div>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="sensitivity">
                                        <Form>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Sensitivity, Density Difference:
                                                </label>
                                                <div className="col-md-9">

                                                    <Select
                                                        value={sensivityDensivityDifference}
                                                        onChange={(selectedValue) => setSensivityDensivityDifference(selectedValue)}
                                                        options={sensivityDensivityDifferenceData}
                                                        getOptionLabel={option => option?.name || ""}
                                                        getOptionValue={option => option?.id?.toString() || ""}
                                                    />
                                                    {!sensivityDensivityDifferenceData && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                                </div>
                                            </Row>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="errors">
                                        <Form>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-3 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Error of the number of the timing mark error:
                                                </label>
                                                <div className="col-md-9">

                                                    <Select
                                                        value={errorOfTheNumberOfTimingMarks}
                                                        onChange={(selectedValue) => setErrorOfTheNumberOfTimingMarks(selectedValue)}
                                                        options={errorOfTheNumberOfTimingMarksData}
                                                        getOptionLabel={option => option?.name || ""}
                                                        getOptionValue={option => option?.id?.toString() || ""}
                                                    />
                                                    {!errorOfTheNumberOfTimingMarks && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                                </div>
                                            </Row>

                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Suspended when an error is detected in the skew mark frame
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={suspendedWhenAnErrorIsDetectedInTheSkewMarksFrame}
                                                        onChange={(e) => setSuspendedWhenAnErrorIsDetectedInTheSkewMarksFrame(e.target.checked)}
                                                    />
                                                    {!suspendedWhenAnErrorIsDetectedInTheSkewMarksFrame && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Suspended when an error is detected in the Id mark frame
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={suspendedWhenAnErrorIsDetectedInTheIdMarksFrame}
                                                        onChange={(e) => setSuspendedWhenAnErrorIsDetectedInTheIdMarksFrame(e.target.checked)}
                                                    />
                                                    {!suspendedWhenAnErrorIsDetectedInTheIdMarksFrame && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Suspended when an error is detected in the mark frame
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={suspendedWhenAnErrorIsDetectedInTheMarksFrame}
                                                        onChange={(e) => setSuspendedWhenAnErrorIsDetectedInTheIdMarksFrame(e.target.checked)}
                                                    />
                                                    {!suspendedWhenAnErrorIsDetectedInTheMarksFrame && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Output the data when mark error detected
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={outputTheDataWhenWarkErrorDetected}
                                                        onChange={(e) => setOutputTheDataWhenMarkErrorDetected(e.target.checked)}
                                                    />
                                                    {!outputTheDataWhenWarkErrorDetected && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Use rejecter
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={useRejecter}
                                                        onChange={(e) => setUseRejecter(e.target.checked)}
                                                    />
                                                    {!useRejecter && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>
                                            <Row>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-6 "
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    Edit the data when mark error detected
                                                </label>
                                                <div className="col-md-1">
                                                    <input type="checkbox"
                                                        className=''
                                                        checked={editTheDataWhenMarkErrorDetected}
                                                        onChange={(e) => setEditTheDataWhenMarkErrorDetected(e.target.checked)}
                                                    />
                                                    {!editTheDataWhenMarkErrorDetected && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                                </div>
                                            </Row>


                                        </Form>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
                    <Button variant="success" onClick={() => {
                        console.log("Form Submitted"); // Implement actual form submission logic
                        setModalShow(false);
                        navigate("/admin/design-template")
                    }}>Create Template</Button>
                </Modal.Footer>
            </Modal>





        </>
    );
};

export default Template;
