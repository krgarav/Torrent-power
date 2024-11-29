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
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTodayFileEntryData } from "helper/fileData_helper";
import { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Toolbar,
  Sort,
  Inject,
  Filter,
} from "@syncfusion/ej2-react-grids";

const DashboardData = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const filterSettings = { type: "Excel" };
  const toolbarOptions = ["Search"];
  const fetchFileEntryData = async () => {
    try {
      const result = await getTodayFileEntryData();
      if (result?.success) {
        setData(result?.result);
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (params.tag == "FILE_ENTRY") {
      fetchFileEntryData();
    }
  }, []);

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

  const handleRowClick = async (d) => {
    try {
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEditRowClick = async (d) => {
    try {
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const dateTemplate = (props) => {
    const date = new Date(props.createdAt);
    return <span>{date.toLocaleDateString()}</span>;
  };
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
                  <h3 className="mt-2">Data</h3>
                </div>
              </CardHeader>
              <div className="table">
                <div className="control-pane">
                  <div className="control-section row justify-content-center">
                    <GridComponent
                      dataSource={data}
                      width="95%"
                      toolbar={toolbarOptions}
                      allowSorting={true}
                      allowFiltering={true}
                      filterSettings={filterSettings}
                      allowPaging={true}
                      pageSettings={{ pageSize: 10, pageCount: 5 }}
                    >
                      <ColumnsDirective>
                        <ColumnDirective
                          field="CSA"
                          headerText="CSA"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="barcode"
                          headerText="Barcode"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="typeOfRequest"
                          headerText="Type Of Request"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="noOfPages"
                          headerText="No of Pages"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="tagging"
                          headerText="Tagging"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="warehouse"
                          headerText="Warehousing"
                          width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                          field="createdAt"
                          headerText="Created At"
                          width="200"
                          template={dateTemplate}
                        ></ColumnDirective>
                        <ColumnDirective
                          headerText="Actions"
                          width="150"
                          template={dropdownTemplate}
                          textAlign="Right"
                        />
                      </ColumnsDirective>
                      <Inject services={[Toolbar, Page, Sort, Filter]} />
                    </GridComponent>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default DashboardData;
