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
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import NormalHeader from 'components/Headers/NormalHeader';
import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import * as url from '../helper/url_helper';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserRoles } from 'helper/userManagment_helper';
import { createUser } from 'helper/userManagment_helper';
import { fetchAllUsers } from 'helper/userManagment_helper';
import { updateUser } from 'helper/userManagment_helper';
import { removeUser } from 'helper/userManagment_helper';

const UserManagment = () => {
  const [modalShow, setModalShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectecdRole, setSelectedRole] = useState({});
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [spanDisplay, setSpanDisplay] = useState('none');
  const [allUsers, setAllUsers] = useState([]);
  const [id, setId] = useState('');
  const [dashboardAccess, setDashboardAccess] = useState(false);
  const [fileEntryAccess, setFileEntryAccess] = useState(false);
  const [taggingAccess, setTaggingAccess] = useState(false);
  const [wareHouseAccess, setWareHouseAccess] = useState(false);
  const [userManagementAccess, setUserManagementAccess] = useState(false);
  const [maintainanceAccess, setMaintainanceAccess] = useState(false);
  const [reportAccess, setReportAccess] = useState(false);
  const [splitAccess, setSplitAccess] = useState(false);
  const [warehouseSetAccess, setwarehouseSetAccess] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await fetchAllUsers();
      if (data?.success) {
        console.log(roles.result);
        setAllUsers(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSelectRole = (selectedValue) => {
    // console.log(selectedValue);
    setSelectedRole(selectedValue);
  };

  const handleUpdate = async () => {
    if (!userName || !email || !mobile) {
      setSpanDisplay('inline');
    } else {
      try {
        let role = selectecdRole.roleName;
        let permissions = {
          dashboardAccess,
          fileEntryAccess,
          taggingAccess,
          wareHouseAccess,
          userManagementAccess,
          maintainanceAccess,
          reportAccess,
          splitAccess,
          warehouseSetAccess,
        };
        const data = await updateUser({
          id,
          userName,
          email,
          mobile,
          permissions,
        });
        if (data?.success) {
          console.log(data.message);
          toast.success(data?.message);
          setUserName('');
          setEmail('');
          setMobile('');
          setSelectedRole('');
          setDashboardAccess(false);
          setFileEntryAccess(false);
          setTaggingAccess(false);
          setWareHouseAccess(false);
          setUserManagementAccess(false);
          setMaintainanceAccess(false);
          setReportAccess(false);
          setwarehouseSetAccess(false);
          setSplitAccess(false);
          setCreateModalShow(false);
          fetchUsers();
          setSpanDisplay('none');
          setModalShow(false);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        let errorMessage = 'Error in creating user, please try again'; // Default error message

        if (error.response) {
          // Server responded with a status other than 200 range
          const { status, data } = error.response;
          if (status === 422) {
            errorMessage = data?.message || 'Validation error occurred';
          } else if (status === 500) {
            errorMessage = 'Server error, please try again later';
          } else {
            errorMessage = data?.message || 'An error occurred';
          }
        } else if (error.request) {
          // Request was made but no response was received
          errorMessage =
            'No response from server, please check your network connection';
        }

        toast.error(errorMessage);
        console.log(error);
      }
    }
  };

  const handleCreate = async () => {
    if (!userName || !email || !mobile || !password || !ConfirmPassword) {
      setSpanDisplay('inline');
    } else {
      if (password !== ConfirmPassword) {
        toast.error('Password did not match');
      } else {
        try {
          let userRole = selectecdRole.roleName;
          let permissions = {
            dashboardAccess,
            fileEntryAccess,
            taggingAccess,
            wareHouseAccess,
            userManagementAccess,
            maintainanceAccess,
            reportAccess,
            splitAccess,
            warehouseSetAccess,
          };

          const data = await createUser({
            userName,
            email,
            mobile,
            permissions,
            password,
          });

          if (data?.success) {
            toast.success(data?.message);
            setUserName('');
            setEmail('');
            setMobile('');
            setSelectedRole('');
            setPassword('');
            setConfirmPassword('');
            setDashboardAccess(false);
            setFileEntryAccess(false);
            setTaggingAccess(false);
            setWareHouseAccess(false);
            setUserManagementAccess(false);
            setMaintainanceAccess(false);
            setCreateModalShow(false);
            setReportAccess(false);
            setSplitAccess(false);
            setwarehouseSetAccess(false);
            fetchUsers();
            setSpanDisplay('none');
          } else {
            toast.error(data?.message);
          }
        } catch (error) {
          let errorMessage = 'Error in creating user, please try again'; // Default error message

          if (error.response) {
            // Server responded with a status other than 200 range
            const { status, data } = error.response;
            if (status === 422) {
              errorMessage = data?.message || 'Validation error occurred';
            } else if (status === 500) {
              errorMessage = 'Server error, please try again later';
            } else {
              errorMessage = data?.message || 'An error occurred';
            }
          } else if (error.request) {
            // Request was made but no response was received
            errorMessage =
              'No response from server, please check your network connection';
          }

          toast.error(errorMessage);
          console.log(error);
        }
      }
    }
  };
  const deleteUser = async (d) => {
    try {
      const data = await removeUser(d.id);
      if (data?.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleRowClick = (d) => {
    // e.preventDefault();
    console.log(d);
    setUserName(d.userName);
    setEmail(d.email);
    setMobile(d.mobile);
    setModalShow(true);
    setId(d.id);

    setDashboardAccess(d.permissions.dashboardAccess);
    setFileEntryAccess(d.permissions.fileEntryAccess);
    setTaggingAccess(d.permissions.taggingAccess);
    setWareHouseAccess(d.permissions.wareHouseAccess);
    setUserManagementAccess(d.permissions.userManagementAccess);
    setMaintainanceAccess(d.permissions.maintainanceAccess);
    setReportAccess(d.permissions.reportAccess);
    setSplitAccess(d.permissions.splitAccess);
    setwarehouseSetAccess(d.permissions.warehouseSetAccess);
  };

  const handleDashboardRights = (e) => {
    dashboardAccess === false
      ? setDashboardAccess(true)
      : setDashboardAccess(false);
  };
  const handleFileEntryRights = (e) => {
    fileEntryAccess === false
      ? setFileEntryAccess(true)
      : setFileEntryAccess(false);
  };
  const handleTaggingRights = (e) => {
    taggingAccess === false ? setTaggingAccess(true) : setTaggingAccess(false);
  };
  const handleWareHouseRights = (e) => {
    wareHouseAccess === false
      ? setWareHouseAccess(true)
      : setWareHouseAccess(false);
  };
  const handleUserManagementRights = (e) => {
    userManagementAccess === false
      ? setUserManagementAccess(true)
      : setUserManagementAccess(false);
  };
  const handleMaintainanceRights = (e) => {
    maintainanceAccess === false
      ? setMaintainanceAccess(true)
      : setMaintainanceAccess(false);
  };
  const handleReportRights = (e) => {
    reportAccess === false ? setReportAccess(true) : setReportAccess(false);
  };

  const handleSplitRights = () => {
    setSplitAccess((prev) => !prev);
  };

  const handleWarehouseSettings = () => {
    setwarehouseSetAccess((prev) => !prev);
  };

  return (
    <>
      <NormalHeader />
      {/* Page content */}
      <Container
        className='mt--7'
        fluid
      >
        {/* Table */}
        <Row>
          <div className='col'>
            <Card className='shadow'>
              <CardHeader className='border-0'>
                <div className='d-flex justify-content-between'>
                  <h3 className='mt-2'>All Users</h3>
                  <Button
                    className=''
                    color='primary'
                    type='button'
                    onClick={() => setCreateModalShow(true)}
                  >
                    Create User
                  </Button>
                </div>
              </CardHeader>
              <Table
                className='align-items-center table-flush mb-5'
                responsive
              >
                <thead className='thead-light'>
                  <tr>
                    <th scope='col'>Sno.</th>
                    <th scope='col'>Username</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Phone Number</th>
                    <th scope='col' />
                  </tr>
                </thead>
                <tbody style={{ minHeight: '100rem' }}>
                  {allUsers?.map((d, i) => (
                    <>
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.userName}</td>
                        <td>{d.email}</td>
                        <td>{d.mobile}</td>
                        <td className='text-right'>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className='btn-icon-only text-light'
                              href='#pablo'
                              role='button'
                              size='sm'
                              color=''
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className='fas fa-ellipsis-v' />
                            </DropdownToggle>
                            <DropdownMenu
                              className='dropdown-menu-arrow'
                              right
                            >
                              <DropdownItem
                                href='#pablo'
                                onClick={() => handleRowClick(d)}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                href='#pablo'
                                onClick={(e) => deleteUser(d)}
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
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Name
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter User Name'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {!userName && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Email
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Email Id'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!email && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Phone Number
            </label>
            <div className='col-md-10'>
              <input
                type='Number'
                className='form-control'
                placeholder='Enter Phone Number'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {!mobile && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <div className='d-flex flex-wrap'>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Dashboard Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='dashboard_access'
                  name='dashboard_access'
                  value={1}
                  onChange={handleDashboardRights}
                  checked={dashboardAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                File Entry Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='file_entry_access'
                  name='file_entry_access'
                  value={1}
                  onChange={handleFileEntryRights}
                  checked={fileEntryAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Tagging Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='tagging_access'
                  name='tagging_access'
                  value={1}
                  onChange={handleTaggingRights}
                  checked={taggingAccess ? 'checked' : ''}
                />
              </div>
            </div>

            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Warehouse Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='warehouse_access'
                  name='warehouse_access'
                  value={1}
                  onChange={handleWareHouseRights}
                  checked={wareHouseAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                User Managment Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='user_managment_access'
                  name='user_managment_access'
                  value={1}
                  onChange={handleUserManagementRights}
                  checked={userManagementAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Maintainance Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='maintainance_access'
                  name='maintainance_access'
                  value={1}
                  onChange={handleMaintainanceRights}
                  checked={maintainanceAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Report Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='maintainance_access'
                  name='maintainance_access'
                  value={1}
                  onChange={handleReportRights}
                  checked={reportAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Split Warehouse
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='split_access'
                  name='split_access'
                  value={1}
                  onChange={handleSplitRights}
                  checked={splitAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Warehouse Setting
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='warehouse_setting_access'
                  name='warehouse_setting_access'
                  value={1}
                  onChange={handleWarehouseSettings}
                  checked={warehouseSetAccess ? 'checked' : ''}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            color='primary'
            onClick={() => setModalShow(false)}
            className='waves-effect waves-light'
          >
            Close
          </Button>{' '}
          <Button
            type='button'
            color='success'
            onClick={handleUpdate}
            className='waves-effect waves-light'
          >
            Update
          </Button>{' '}
        </Modal.Footer>
      </Modal>

      <Modal
        show={createModalShow}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Create User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Name
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter User Name'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {!userName && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Email
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Email Id'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!email && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Phone Number
            </label>
            <div className='col-md-10'>
              <input
                type='Number'
                className='form-control'
                placeholder='Enter Phone Number'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {!mobile && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Password
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!password && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Confirm Password
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Password'
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!ConfirmPassword && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <div className='d-flex flex-wrap'>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Dashboard Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='dashboard_access'
                  name='dashboard_access'
                  value={1}
                  onChange={handleDashboardRights}
                  checked={dashboardAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                File Entry Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='file_entry_access'
                  name='file_entry_access'
                  value={1}
                  onChange={handleFileEntryRights}
                  checked={fileEntryAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='user_Management_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Tagging Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='tagging_access'
                  name='tagging_access'
                  value={1}
                  onChange={handleTaggingRights}
                  checked={taggingAccess ? 'checked' : ''}
                />
              </div>
            </div>

            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Warehouse Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='warehouse_access'
                  name='warehouse_access'
                  value={1}
                  onChange={handleWareHouseRights}
                  checked={wareHouseAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                User Managment Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='user_managment_access'
                  name='user_managment_access'
                  value={1}
                  onChange={handleUserManagementRights}
                  checked={userManagementAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Maintainance Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='maintainance_access'
                  name='maintainance_access'
                  value={1}
                  onChange={handleMaintainanceRights}
                  checked={maintainanceAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Report Access
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='maintainance_access'
                  name='maintainance_access'
                  value={1}
                  onChange={handleReportRights}
                  checked={reportAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Split Warehouse
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='split_access'
                  name='split_access'
                  value={1}
                  onChange={handleSplitRights}
                  checked={splitAccess ? 'checked' : ''}
                />
              </div>
            </div>
            <div className='mb-3 col-md-4 col-12 d-flex align-items-center'>
              <label
                htmlFor='warehouse_access'
                className='col-md-6 col-form-label'
                style={{ fontSize: '.8rem' }}
              >
                Warehouse Setting
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  id='warehouse_setting_access'
                  name='warehouse_setting_access'
                  value={1}
                  onChange={handleWarehouseSettings}
                  checked={warehouseSetAccess ? 'checked' : ''}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            color='primary'
            onClick={() => setCreateModalShow(false)}
            className='waves-effect waves-light'
          >
            Close
          </Button>{' '}
          <Button
            type='button'
            color='success'
            onClick={handleCreate}
            className='waves-effect waves-light'
          >
            Create
          </Button>{' '}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagment;
