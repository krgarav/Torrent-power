/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================
*/

import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import NormalHeader from 'components/Headers/NormalHeader';
import Loader from 'components/Loader/Loader';
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from 'helper/warehouseSetting_helper';
import { toast } from 'react-toastify';

const WarehouseSetting = () => {
  const [loader, setLoader] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  // modal controls
  const [createModalShow, setCreateModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);

  // form states
  const [warehouseName, setWarehouseName] = useState('');
  const [totalFloor, setTotalFloor] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [spanDisplay, setSpanDisplay] = useState('none');

  /* ================= FETCH ================= */
  const fetchWarehouses = async () => {
    try {
      setLoader(true);
      const res = await getAllWarehouses();

      if (res?.success) {
        const mappedData = res.data.map((item) => ({
          id: item.id,
          name: item.warehouse_name,
          totalFloor: item.total_floors,
          createdAt: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : '-',
        }));

        setWarehouses(mappedData);
      }
    } catch (error) {
      toast.error('Failed to fetch warehouses');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!warehouseName || !totalFloor) {
      setSpanDisplay('inline');
      return;
    }

    try {
      setLoader(true);
      const res = await createWarehouse({
        warehouseName,
        totalFloors: totalFloor,
      });

      if (res?.success) {
        toast.success(res.message);
        setCreateModalShow(false);
        setWarehouseName('');
        setTotalFloor('');
        setSpanDisplay('none');
        fetchWarehouses();
      }
    } catch {
      toast.error('Error creating warehouse');
    } finally {
      setLoader(false);
    }
  };

  /* ================= EDIT ================= */
  const handleRowClick = (w) => {
    setSelectedId(w.id);
    setWarehouseName(w.name);
    setTotalFloor(w.totalFloor);
    setEditModalShow(true);
  };

  const handleUpdate = async () => {
    if (!warehouseName || !totalFloor) {
      setSpanDisplay('inline');
      return;
    }

    try {
      setLoader(true);
      const res = await updateWarehouse(selectedId, {
        warehouseName,
        totalFloors: totalFloor,
      });

      if (res?.success) {
        toast.success(res.message);
        setEditModalShow(false);
        setWarehouseName('');
        setTotalFloor('');
        setSpanDisplay('none');
        fetchWarehouses();
      }
    } catch {
      toast.error('Error updating warehouse');
    } finally {
      setLoader(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      setLoader(true);
      const res = await deleteWarehouse(id);

      if (res?.success) {
        toast.success(res.message);
        fetchWarehouses();
      }
    } catch {
      toast.error('Error deleting warehouse');
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <NormalHeader />

      <Container
        className='mt--7'
        fluid
      >
        {loader && <Loader />}

        <Row>
          <div className='col'>
            <Card className='shadow'>
              <CardHeader className='border-0'>
                <div className='d-flex justify-content-between'>
                  <h3 className='mt-2'>Warehouse Setting</h3>
                  <Button
                    color='primary'
                    onClick={() => setCreateModalShow(true)}
                  >
                    Create Warehouse
                  </Button>
                </div>
              </CardHeader>

              <Table
                className='align-items-center table-flush mb-5'
                responsive
              >
                <thead className='thead-light'>
                  <tr>
                    <th>S.No</th>
                    <th>Warehouse Name</th>
                    <th>Total Floors</th>
                    <th>Created At</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {warehouses.length === 0 ? (
                    <tr>
                      <td
                        colSpan='5'
                        className='text-center'
                      >
                        No warehouses found
                      </td>
                    </tr>
                  ) : (
                    warehouses.map((w, i) => (
                      <tr key={w.id}>
                        <td>{i + 1}</td>
                        <td>{w.name}</td>
                        <td>{w.totalFloor}</td>
                        <td>{w.createdAt}</td>
                        <td className='text-right'>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className='btn-icon-only text-light'
                              size='sm'
                              color=''
                            >
                              <i className='fas fa-ellipsis-v' />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem onClick={() => handleRowClick(w)}>
                                Edit
                              </DropdownItem>
                              <DropdownItem onClick={() => handleDelete(w.id)}>
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {/* ================= CREATE MODAL ================= */}
      <Modal
        show={createModalShow}
        size='lg'
        centered
      >
        <Modal.Header>
          <Modal.Title>Create Warehouse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label className='col-md-3 col-form-label'>Warehouse Name</label>
            <div className='col-md-9'>
              <input
                className='form-control'
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
              {!warehouseName && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This field is required
                </span>
              )}
            </div>
          </Row>

          <Row>
            <label className='col-md-3 col-form-label'>Total Floors</label>
            <div className='col-md-9'>
              <input
                type='number'
                className='form-control'
                value={totalFloor}
                onChange={(e) => setTotalFloor(e.target.value)}
              />
              {!totalFloor && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This field is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color='primary'
            onClick={() => setCreateModalShow(false)}
          >
            Close
          </Button>
          <Button
            color='success'
            onClick={handleCreate}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        show={editModalShow}
        size='lg'
        centered
      >
        <Modal.Header>
          <Modal.Title>Edit Warehouse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label className='col-md-3 col-form-label'>Warehouse Name</label>
            <div className='col-md-9'>
              <input
                className='form-control'
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </div>
          </Row>

          <Row>
            <label className='col-md-3 col-form-label'>Total Floors</label>
            <div className='col-md-9'>
              <input
                type='number'
                className='form-control'
                value={totalFloor}
                onChange={(e) => setTotalFloor(e.target.value)}
              />
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color='primary'
            onClick={() => setEditModalShow(false)}
          >
            Close
          </Button>
          <Button
            color='success'
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WarehouseSetting;
