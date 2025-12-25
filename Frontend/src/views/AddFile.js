import Header from 'components/Headers/Header.js';
import NormalHeader from 'components/Headers/NormalHeader';
import { Modal } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardHeader, Container, Row } from 'reactstrap';
import axios from 'axios';
import { post } from 'helper/api_helper';
import { genrateBarcode } from 'helper/barcode_helper';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import { printBarcode } from 'helper/barcode_helper';
import { saveFileData } from 'helper/fileData_helper';
import Loader from 'components/Loader/Loader';
import AllFilesTable from './addFileComponents/AllFilesTable';
import { getAllFilesData } from 'helper/fileData_helper';
import { downloadDataCsv } from 'helper/analysis_helper';
import { DOWNLOAD_DATA_CSV } from 'helper/url_helper';
import { DOWNLOAD_PDF } from 'helper/url_helper';
import Select from 'react-select';
import { updateFileData } from 'helper/fileData_helper';
import { GET_ALL_FILEDATA } from 'helper/url_helper';
import { GET_SEARCH_FILE_DATA } from 'helper/url_helper';
import CreatableSelect from 'react-select/creatable';
const typeOfRequestData = [
  { label: 'Name Change', value: 'Name Change' },
  { label: 'New Connection', value: 'New Connection' },
  { label: 'Shifting', value: 'Shifting' },
  { label: 'Category Change', value: 'Category Change' },
  { label: 'Extension/Reduction', value: 'Extension/Reduction' },
  { label: 'Service Removal', value: 'Service Removal' },
  { label: 'Long Term Support', value: 'Long Term Support' },
  { label: 'Seen On', value: 'Seen On' },
  { label: 'Address Correction', value: 'Address Correction' },
  { label: 'Solar', value: 'Solar' },
  { label: 'PD Service', value: 'PD Service' },
  { label: 'Online File', value: 'Online File' },
  { label: 'Long Term Temporary', value: 'Long Term Temporary' },
  { label: 'PDC on Account', value: 'PDC on Account' },
  { label: 'YSRD', value: 'YSRD' },
  { label: 'Complaint', value: 'Complaint' },
  { label: 'Load Extension', value: 'Load Extension' },
  { label: 'Long Term New Connection', value: 'Long Term New Connection' },
  {
    label: 'Old Reconnection Application',
    value: 'Old Reconnection Application',
  },
  { label: 'LLC', value: 'LLC' },
  { label: 'MCR', value: 'MCR' },
  { label: 'GST', value: 'GST' },
  { label: 'LETTER', value: 'LETTER' },

  { label: 'Site Visit Report', value: 'Site Visit Report' },
  { label: 'MSR', value: 'MSR' },
];

// const typeOfRequestData = [
//   { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
//   { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
//   { value: 'purple', label: 'Purple', color: '#5243AA' },
//   { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
//   { value: 'orange', label: 'Orange', color: '#FF8B00' },
//   { value: 'yellow', label: 'Yellow', color: '#FFC400' },
//   { value: 'green', label: 'Green', color: '#36B37E' },
//   { value: 'forest', label: 'Forest', color: '#00875A' },
//   { value: 'slate', label: 'Slate', color: '#253858' },
//   { value: 'silver', label: 'Silver', color: '#666666' },
// ]
const AddFile = () => {
  const [CSANumber, setCSANumber] = useState('');
  const [spanDisplay, setSpanDisplay] = useState('none');
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [message, setMessage] = useState('');
  const [typeOfRequest, setTypeOfRequest] = useState(null);
  const [noOfPages, setNoOfPages] = useState(0);
  const [dateOfApplication, setDateOfApplication] = useState('');
  const [loader, setLoader] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [allFilesDisplay, setAllFilesDisplay] = useState(true);
  const [files, setFiles] = useState([]);

  const [fileDetailData, setFileDetailData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [collectionPoint, setCollectionPoint] = useState('');
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState('');
  const barcodeInputRef = useRef(null);
  const dataRef = useRef({
    CSANumber,
    barcode,
    typeOfRequest,
    noOfPages,
    dateOfApplication,
    collectionPoint,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState(typeOfRequestData);
  const handleBlurInputChange = (e) => {
    const value = e.target.value.trim();

    // Allow only numbers and restrict length to 9 digits
    if (/^\d{0,9}$/.test(value)) {
      setCSANumber(value);
    }

    // Display an error if the length isn't 9
    if (value.length === 9 || value.length === 0) {
      setErrorMessage(''); // Valid length
    } else if (value.length > 9) {
      alert('CSA Number should not exceed 9 digits.');
      setErrorMessage('CSA Number should not exceed 9 digits.');
    } else {
      alert('CSA Number must be exactly 9 digits.');
      setErrorMessage('CSA Number must be exactly 9 digits.');
    }
  };
  const handleChanges = (selectedOption) => {
    // Add the new option if it was created
    if (selectedOption && selectedOption.__isNew__) {
      setOptions((prevOptions) => [
        ...prevOptions,
        { id: options.length + 1, name: selectedOption.label },
      ]);
    }
    setTypeOfRequest(selectedOption);
  };

  const fetchAllFiles = async (pageNumber = 1, pageSize = 10) => {
    try {
      const { data } = await axios.get(GET_ALL_FILEDATA, {
        params: { pageNumber, pageSize },
      });
      if (data?.success) {
        setFiles(data?.data);
        setTotalRecords(data.totalRecords); // Store the total records for pagination
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchAllFiles(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page);
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const collectionPointData = [
    { id: 1, name: 'Jaipur House' },
    { id: 2, name: 'Pratap Pura' },
    { id: 3, name: 'Sanjay Palace' },
  ];

  const handleSave = async () => {
    const {
      CSANumber,
      barcode,
      typeOfRequest,
      noOfPages,
      dateOfApplication,
      collectionPoint,
    } = dataRef.current;

    if (CSANumber.length !== 9) {
      const res = window.confirm(
        'CSA Length less than 9 digit, Are you sure you want to proceed?'
      );
      if (!res) {
        return;
      }
    }
    try {
      setLoader(true);
      const data = await saveFileData({
        CSA: CSANumber,
        typeOfRequest: typeOfRequest.value,
        noOfPages,
        dateOfApplication,
        barcode,
        collPoint: collectionPoint.name,
      });
      setLoader(false);
      if (data?.success) {
        toast.success(data?.message);
        setCSANumber('');
        setNoOfPages(0);
        setBarcode(+barcode + 1);
        barcodeInputRef.current.focus();
        fetchAllFiles();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error?.response?.data?.message);
    }
  };
  const handleUpdate = async () => {
    let CSA = CSANumber;
    try {
      console.log(
        CSA,
        typeOfRequest,
        noOfPages,
        dateOfApplication,
        'barcode',
        barcode
      );
      let collPoint = collectionPoint.name;

      console.log('collPoint', collectionPoint);
      setLoader(true);
      const data = await updateFileData({
        CSA,
        typeOfRequest: typeOfRequest.value,
        noOfPages,
        dateOfApplication,
        barcode,
        collPoint,
        selectedFileId,
      });
      setLoader(false);
      if (data?.success) {
        toast.success(data?.message);
        setCSANumber('');
        setNoOfPages('');
        // setDateOfApplication("");
        setBarcode('');
        setUpdateModal(false);
        fetchAllFiles();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error generating barcode:', error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChange = (event) => {
    // Get the value from the input field
    const scannedValue = event.target.value.trim();
    if (/^\d*$/.test(scannedValue)) {
      setBarcode(scannedValue);
    }
    // Update the barcode state with the scanned value
    // setBarcode(scannedValue);

    // Optionally, clear the input field after processing
    // event.target.value = ''; // Uncomment this line if you want to clear the field after scanning
  };

  const handleDownload = async (pdfName, csa) => {
    try {
      setLoader(true);
      const response = await axios.post(
        DOWNLOAD_PDF,
        { pdfName, csa },
        { responseType: 'blob' } // Important for file downloads
      );
      setLoader(false);

      // Create a link element, set its href to the blob URL, and click it to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', pdfName); // Use the PDF name for the download filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Error downloading the file');
      setLoader(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      setLoader(true);
      const response = await axios({
        url: DOWNLOAD_DATA_CSV,
        method: 'POST',
        data: { from, to },
        responseType: 'blob',
      });
      setLoader(false);

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error, 'fdfdf');
      setLoader(false);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    // Update ref whenever state changes
    dataRef.current = {
      CSANumber,
      barcode,
      typeOfRequest,
      noOfPages,
      dateOfApplication,
      collectionPoint,
    };
  }, [
    CSANumber,
    barcode,
    typeOfRequest,
    noOfPages,
    dateOfApplication,
    collectionPoint,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 's') {
        event.preventDefault(); // Prevent the default behavior (if any)

        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <NormalHeader />
      <Container
        className='mt--7'
        fluid
      >
        {loader ? <Loader /> : ''}
        {allFilesDisplay ? (
          <AllFilesTable
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            typeOfRequestData={typeOfRequestData}
            setSelectedFileId={setSelectedFileId}
            collectionPointData={collectionPointData}
            setCSANumber={setCSANumber}
            setTypeOfRequest={setTypeOfRequest}
            setNoOfPages={setNoOfPages}
            setDateOfApplication={setDateOfApplication}
            setBarcode={setBarcode}
            setCollectionPoint={setCollectionPoint}
            files={files}
            setUpdateModal={setUpdateModal}
            setFiles={setFiles}
            setDownloadModal={setDownloadModal}
            setModalShow={setModalShow}
            setFileDetailData={setFileDetailData}
            setLoader={setLoader}
            setAllFilesDisplay={setAllFilesDisplay}
          />
        ) : (
          <Row>
            <div className='col'>
              <Card className='shadow'>
                <CardHeader className='border-0'>
                  <div className='d-flex justify-content-between mb-2'>
                    <h3 className='mt-2'>Add File</h3>
                    <Button
                      className=''
                      color='primary'
                      type='button'
                      onClick={() => setAllFilesDisplay(true)}
                    >
                      All Files
                    </Button>
                  </div>
                  <Row className='mb-3'>
                    <label
                      htmlFor='example-text-input'
                      className='col-md-2 col-form-label'
                    >
                      Barcode
                    </label>
                    <div className='col-md-10'>
                      <input
                        type='text'
                        className='form-control'
                        value={barcode}
                        ref={barcodeInputRef}
                        placeholder='Scan barcode here'
                        onChange={handleChange}
                        autoFocus // Automatically focus the input field when the component mounts
                        style={{ color: 'black' }}
                      />
                      {!barcode && (
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
                      CSA Number
                    </label>
                    <div className='col-md-10'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Enter Customer Service Number'
                        value={CSANumber}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          if (/^\d{0,9}$/.test(value)) {
                            setCSANumber(value);
                          }
                        }}
                        onBlur={handleBlurInputChange}
                        style={{ color: 'black' }}
                      />
                      {!CSANumber && (
                        <span style={{ color: 'red', display: spanDisplay }}>
                          This feild is required
                        </span>
                      )}
                    </div>
                  </Row>
                  {/* <Row className="mb-3">
                    <label
                      htmlFor="example-text-input"
                      className="col-md-2 col-form-label"
                    >
                      Type of Request
                    </label>
                    <div className="col-md-10">
                      <Select
                        onChange={(selectedOption) =>
                          setTypeOfRequest(selectedOption)
                        }
                        options={typeOfRequestData}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        classNamePrefix="select2-selection"
                        value={typeOfRequest}
                      />

                      {!typeOfRequest && (
                        <span style={{ color: "red", display: spanDisplay }}>
                          This feild is required
                        </span>
                      )}
                    </div>
                  </Row> */}
                  <Row className='mb-3'>
                    <label
                      htmlFor='example-text-input'
                      className='col-md-2 col-form-label'
                    >
                      Type of Request
                    </label>
                    <div className='col-md-10'>
                      <CreatableSelect
                        isClearable
                        onChange={(val) => {
                          console.log(val);
                          if (val) {
                            setTypeOfRequest(val);
                          }
                        }}
                        options={typeOfRequestData}
                        // getOptionLabel={(option) => option?.name}
                        // getOptionValue={(option) => option?.id?.toString()}
                        value={typeOfRequest}
                      />
                    </div>
                  </Row>
                  <Row className='mb-3'>
                    <label
                      htmlFor='example-text-input'
                      className='col-md-2 col-form-label'
                    >
                      Collection Point
                    </label>
                    <div className='col-md-10'>
                      <Select
                        onChange={(selectedOption) =>
                          setCollectionPoint(selectedOption)
                        }
                        options={collectionPointData}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        classNamePrefix='select2-selection'
                        value={collectionPoint}
                      />
                    </div>
                  </Row>
                  <Row className='mb-3'>
                    <label
                      htmlFor='example-text-input'
                      className='col-md-2 col-form-label'
                    >
                      No of Pages
                    </label>
                    <div className='col-md-10'>
                      <input
                        type='Number'
                        className='form-control'
                        placeholder='Enter Number of Pages'
                        value={noOfPages}
                        onChange={(e) => setNoOfPages(e.target.value)}
                        style={{ color: 'black' }}
                      />
                      {!noOfPages && (
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
                      Date of Application
                    </label>
                    <div className='col-md-10'>
                      <input
                        type='date'
                        className='form-control'
                        placeholder='Enter Date of Application'
                        value={dateOfApplication}
                        style={{ color: 'black' }}
                        onChange={(e) => setDateOfApplication(e.target.value)}
                      />
                      {!dateOfApplication && (
                        <span style={{ color: 'red', display: spanDisplay }}>
                          This feild is required
                        </span>
                      )}
                    </div>
                  </Row>
                  <div className='functions mt-2 d-flex justify-content-end'>
                    <Button
                      className=''
                      color='success'
                      type='button'
                      onClick={handleSave}
                    >
                      Save Data
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </Row>
        )}
      </Container>

      {/* modal for view file data in detail  */}
      <Modal
        show={modalShow}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            File Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=''>CSA Number: {fileDetailData?.fileData?.CSA}</div>
          <div className=''>Barcode: {fileDetailData?.fileData?.barcode}</div>
          <div className=''>
            Type Of Request: {fileDetailData?.fileData?.typeOfRequest}
          </div>
          <div className=''>
            Collection Point: {fileDetailData?.fileData?.collectionPoint}
          </div>
          <div className=''>
            No Of Pages: {fileDetailData?.fileData?.noOfPages}
          </div>
          <div className=''>
            Entry Date: {fileDetailData?.fileData?.createdAt}
          </div>
          <br />
          <br />
          <div className=''>
            <h3>
              {fileDetailData?.tagging?.length > 0
                ? 'Tagging Documents'
                : 'Tagging Pending'}
            </h3>
          </div>

          {fileDetailData?.tagging?.length > 0 && (
            <>
              {fileDetailData?.tagging?.map((d, i) => (
                <>
                  <div className='d-flex justify-content-between mb-2'>
                    <p className='mr-5'>
                      {i + 1}. {d?.documentName}
                    </p>
                    {/* <Button className="ml-5" color="success" type="button" onClick={() => handleDownload(d?.pdfFileName, d?.CSA)}>Download</Button> */}
                  </div>
                </>
              ))}
            </>
          )}
          <br />
          <br />

          <div className=''>
            <h3>
              {fileDetailData?.warehouse?.length > 0
                ? 'Warehouse Details'
                : 'Warehouse Pending'}
            </h3>
          </div>

          <div className=''>
            Box No: {fileDetailData?.warehouse?.[0]?.boxNumber}
          </div>
          <div className=''>
            Shelf No: {fileDetailData?.warehouse?.[0]?.shelfNumber}
          </div>
          <div className=''>
            Rack No: {fileDetailData?.warehouse?.[0]?.rackNumber}
          </div>
          <div className=''>
            Floor No: {fileDetailData?.warehouse?.[0]?.floorNumber}
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
        </Modal.Footer>
      </Modal>

      {/* modal for download data in csv  */}

      <Modal
        show={downloadModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Download data in csv
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              From
            </label>
            <div className='col-md-10'>
              <input
                type='date'
                className='form-control'
                placeholder='From'
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              {!from && (
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
              To
            </label>
            <div className='col-md-10'>
              <input
                type='date'
                className='form-control'
                placeholder='To'
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              {!to && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            color='primary'
            onClick={() => setDownloadModal(false)}
            className='waves-effect waves-light'
          >
            Close
          </Button>{' '}
          <Button
            type='button'
            color='success'
            onClick={handleDownloadCsv}
            className='waves-effect waves-light'
          >
            Download
          </Button>{' '}
        </Modal.Footer>
      </Modal>

      {/* Modal for update file data  */}
      <Modal
        show={updateModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Update File Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Barcode
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                value={barcode}
                placeholder='Scan barcode here'
                onChange={handleChange}
                autoFocus // Automatically focus the input field when the component mounts
                style={{ color: 'black' }}
              />
              {!barcode && (
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
              CSA Number
            </label>
            <div className='col-md-10'>
              <input
                type='text'
                className='form-control'
                placeholder='Enter Customer Service Number'
                value={CSANumber}
                onChange={(e) => setCSANumber(e.target.value)}
                style={{ color: 'black' }}
              />
              {!CSANumber && (
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
              Type of Request
            </label>
            <div className='col-md-10'>
              <CreatableSelect
                isClearable
                onChange={(val) => {
                  console.log(val);
                  if (val) {
                    setTypeOfRequest(val);
                  }
                }}
                options={typeOfRequestData}
                // getOptionLabel={(option) => option?.name}
                // getOptionValue={(option) => option?.id?.toString()}
                value={typeOfRequest}
              />
            </div>
          </Row>

          {/* <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Type of Request
            </label>
            <div className="col-md-10">
              <Select
                onChange={(selectedOption) => setTypeOfRequest(selectedOption)}
                options={typeOfRequestData}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id?.toString()}
                classNamePrefix="select2-selection"
                value={typeOfRequest}
              />
              {!typeOfRequest && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row> */}
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              Collection Point
            </label>
            <div className='col-md-10'>
              <Select
                onChange={(selectedOption) =>
                  setCollectionPoint(selectedOption)
                }
                options={collectionPointData}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id?.toString()}
                classNamePrefix='select2-selection'
                value={collectionPoint}
              />
            </div>
          </Row>
          <Row className='mb-3'>
            <label
              htmlFor='example-text-input'
              className='col-md-2 col-form-label'
            >
              No of Pages
            </label>
            <div className='col-md-10'>
              <input
                type='Number'
                className='form-control'
                placeholder='Enter Number of Pages'
                value={noOfPages}
                onChange={(e) => setNoOfPages(e.target.value)}
                style={{ color: 'black' }}
              />
              {!noOfPages && (
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
              Date of Application
            </label>
            <div className='col-md-10'>
              <input
                type='date'
                className='form-control'
                placeholder='Enter Date of Application'
                value={dateOfApplication}
                style={{ color: 'black' }}
                onChange={(e) => setDateOfApplication(e.target.value)}
              />
              {!dateOfApplication && (
                <span style={{ color: 'red', display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            color='primary'
            onClick={() => setUpdateModal(false)}
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
    </>
  );
};

export default AddFile;
