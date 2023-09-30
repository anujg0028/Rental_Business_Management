import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Button, Card, CardBody, Container, Row, Col, Table } from 'reactstrap';
import './common.css'
import Tab from './TabE'
import TabItem from './TabItem';
import { useContext } from 'react';
import { UserContext } from '../Context/userContext';
import { getAll, getAllByMonth, getById, getTotalElect, updateElectric } from '../Services/ElectricityService';
import editLogo from './edit.jpg'
import { toast } from 'react-toastify';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import download from './download.png';
import dot from './dot.png';
import { doLogout } from '../AuthServices/Auth';

const monthsMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

function Electricity({ direction, ...args }) {

    const monthArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const navigate = useNavigate();
    const [electricity, setElectricity] = useState([]);
    const [tenant, setTenant] = useState([]);
    const { SelectedId, SelectMonth, AddElectric, YearE } = useContext(UserContext);
    const { AddE: addE, updateE } = AddElectric;
    const { yearE: yearE, updateYearE } = YearE;
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAuth, setIsOpenAuth] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpenPaid, setIsOpenPaid] = useState(false);
    const [isOpenDown, setIsOpenDown] = useState(false);
    const [isCardHovered1, setIsCardHovered1] = useState(false);
    const [isCardHovered2, setIsCardHovered2] = useState(false);
    const [isCardHovered3, setIsCardHovered3] = useState(false);
    const [isCardHovered4, setIsCardHovered4] = useState(false);
    const [totalElect, setTotalElect] = useState({
        Total: '',
        UPTot: '',
        HPTot: ''
    });

    const [data, setData] = useState({
        Original_Date: '',
        Amount_Left: '',
        Amount_Paid: '',
        Name: '',
        Status: '',
        RentId: '',
        Paid_Date: '',
        Month: '',
        Current_Reading: '',
        Past_Reading: '',
        Unit_Used: '',
        Amount: '',
        Month_Left: '',
        Year: ''
    });

    const toggleModal1 = () => {
        resetData();
        setIsOpen1(!isOpen1);
    };

    const toggleModalDown = () => {
        setIsOpenDown(!isOpenDown);
    };

    const toggleModalAuth = () => {
        setIsOpenAuth(!isOpenAuth);
    };

    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    //handle  add form change
    const handleChange = (event, field) => {

        if (!/^\d*$/.test(event.target.value)) {
            setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only numeric values allowed' } } }, isError: true });
        } else {
            setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
        }
        setData({ ...data, [field]: event.target.value })
    }

    //reseting the form
    const resetData = () => {
        setData({
            Original_Date: '',
            Amount_Left: '',
            Amount_Paid: '',
            Name: '',
            Status: '',
            RentId: '',
            Paid_Date: '',
            Month: '',
            Current_Reading: '',
            Past_Reading: '',
            Unit_Used: '',
            Amount: '',
            Month_Left: '',
            Year: ''
        })
    };

    const fetchAll = async () => {
        let year = SelectMonth.month.slice(0, 4);
        let month = monthArr[parseInt(SelectMonth.month.slice(5))]
        const result = await getAllByMonth(month, year);
        if (result == "Unautho") {
            if (isOpenAuth == false) { setElectricity([]); toggleModalAuth(); }
        }
        else {
            if (result.Data.length > 0) setElectricity([...result.Data]);
            else { setElectricity([]); toggleModal() }
            if (AddElectric.AddE) updateE(false);
        }
    }

    const fetchToatlElect = async () => {
        let year = SelectMonth.month.slice(0, 4);
        let month = monthArr[parseInt(SelectMonth.month.slice(5))]
        const result = await getTotalElect(month, year)
        if (result == "Unautho") {
            if (isOpenAuth == false) {
                setTotalElect({
                    Total: '',
                    UPTot: '',
                    HPTot: ''
                }); toggleModalAuth();
            }
        }
        else setTotalElect({ ...result.Data });
    }

    if (AddElectric.AddE) { fetchAll(); fetchToatlElect(); }

    const fetchAllById = async () => {
        const result = await getById(SelectedId.Id, YearE.yearE);
        if (result == "Unautho") {
            if (isOpenAuth == false) { setTenant([]); toggleModalAuth(); }
        }
        else {
            if (result) setTenant([...result.Data.sort((a, b) => {
                const monthA = monthsMap[a.Month];
                const monthB = monthsMap[b.Month];
                return monthB - monthA;
            })]);
            else if (result == null) { setTenant([]); toggleModal(); }
        }
    }


    //submitting the form
    const submitForm = async (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        //data validation
        if (!/^\d*$/.test(data.Amount_Paid)) {
            toast.error("Amount Should be Valid!!");
            return;
        }
        toggleModal1();
        //server call
        const aa = await updateElectric(data);
        if (aa == "Unautho" && isOpenAuth == false) toggleModalAuth();
        toast.success("Electricity Detail Updated!")
        resetData();
        fetchAll();
        fetchAllById();
        fetchToatlElect();
    }

    const handleEditButtonClick = (electric) => {
        setData({
            Original_Date: electric.Original_Date,
            Amount_Left: electric.Amount_Left,
            Amount_Paid: electric.Amount_Paid,
            Name: electric.Name,
            Status: electric.Status,
            RentId: electric.RentId,
            Paid_Date: electric.Paid_Date,
            Month: electric.Month,
            Current_Reading: electric.Current_Reading,
            Past_Reading: electric.Past_Reading,
            Unit_Used: electric.Unit_Used,
            Amount: electric.Amount,
            Month_Left: electric.Month_Left,
            Year: electric.Year
        });
        setIsOpen1(!isOpen1);
    };

    const completeSubmit = async (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        toggleModal1();
        //server call
        console.log(data)
        const aa = await updateElectric(data, 'Complete');
        if (aa == "Unautho" && isOpenAuth == false) toggleModalAuth();
        toast.success("Electricity Bill Completed!")
        resetData();
        fetchAll();
        fetchAllById();
        fetchToatlElect();
    }

    const toggleModalPaid = () => {
        setIsOpenPaid(!isOpenPaid);
    };

    const handlePaidButtonClick = () => {
        setIsOpenPaid(!isOpenPaid);
    };

    useEffect(() => {
        fetchAll();
        fetchToatlElect();
    }, [SelectMonth.month])

    useEffect(() => {
        if (tenant.length == 0) fetchAllById();
        if (tenant.length > 0 && tenant[0].Year != YearE.yearE) fetchAllById();
    }, [YearE.yearE])

    useEffect(() => {
        fetchAllById();
    }, [SelectedId.Id])

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    function formatNumber(value) {
        if (value == null) return null
        return value.toLocaleString('en-IN');
    }

    function handleDownButtonClick(electric) {
        navigate(`/user/download/electricity/${electric.RentId}/month/${electric.Month}/year/${electric.Year}/receipt`)
    }

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    return (
        // <Container className="mt-4" style={{ maxWidth: "1400px", height: "300px", overflow: "auto" }}>
        <Container className="mt-4" style={{ maxWidth: "1400px" }}>
            <Tab>
                <TabItem label='Electricity'>
                    <Container className='mt-3'>
                        <Row>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4 ${isCardHovered1 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered1(true)}
                                    onMouseLeave={() => setIsCardHovered1(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '13px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Electricity Collected</h7>
                                        <h4 className='mt-3' style={{ fontWeight: '400' }} >{formatNumber(totalElect.Total)}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4 ${isCardHovered2 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered2(true)}
                                    onMouseLeave={() => setIsCardHovered2(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '10px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Unpaid Electricity</h7>
                                        <h4 className='mt-3' style={{ fontWeight: '400' }}>{totalElect.UPTot}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4  ${isCardHovered3 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered3(true)}
                                    onMouseLeave={() => setIsCardHovered3(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '10px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Half Paid Electricity</h7>
                                        <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{totalElect.HPTot}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4  ${isCardHovered4 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered4(true)}
                                    onMouseLeave={() => setIsCardHovered4(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '9px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Left Electricity</h7>
                                        <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{totalElect.LTot}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    <div className='mt-4' style={{ overflowX: 'auto', width: '1200px', marginLeft: '57px' }}>
                        <Row className='mt-4' style={{ width: '1300px' }}>
                            <Table
                                bordered
                                hover
                                responsive
                                size=""
                                striped
                                className='text-center shadow border-2'
                                style={{ backgroundColor: "purple", color: "white" }}
                            >
                                <thead >
                                    <tr>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Name
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Original Pay Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Current Reading
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Past Reading
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Unit Used
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Paid
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Status
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Paid Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Month Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    electricity.length > 0 && (
                                        <tbody>
                                            {
                                                electricity.map((Electric) => (
                                                    <tr>
                                                        <td scope="row" key={2}>
                                                            {Electric.Name}
                                                        </td>
                                                        <td scope="row" key={3}>
                                                            {Electric.Original_Date}
                                                        </td>
                                                        <td scope="row" key={5}>
                                                            {Electric.Current_Reading}
                                                        </td>
                                                        <td scope="row" key={5}>
                                                            {Electric.Past_Reading}
                                                        </td>
                                                        <td scope="row" key={6}>
                                                            {Electric.Unit_Used}
                                                        </td>
                                                        <td scope="row" key={7}>
                                                            {Electric.Amount}
                                                        </td>
                                                        <td scope="row" key={8}>
                                                            {Electric.Amount_Paid}
                                                        </td>
                                                        <td scope="row" key={9}>
                                                            {Electric.Amount_Left}
                                                        </td>
                                                        <td scope="row" key={10}>
                                                            {Electric.Status}
                                                        </td>
                                                        <td scope="row" key={11}>
                                                            {Electric.Paid_Date}
                                                        </td>
                                                        <td scope="row" key={12}>
                                                            {Electric.Month_Left}
                                                        </td>
                                                        <td scope="row" key={13}>
                                                            {/* <img src={editLogo} height="5" width={20} className='img-fluid ms-2' onClick={() => {
                                                                if (Electric.Status == 'PAID' || Electric.Status == 'LEFT') handlePaidButtonClick()
                                                                else handleEditButtonClick(Electric)
                                                            }} /> */}
                                                            <DropdownButton
                                                                id={`dropdown-${Electric.RentId}`}
                                                                title={<img src={dot} width={20} />}
                                                                variant="transparent custom-dropdown-button"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    if (Electric.Status == 'PAID' || Electric.Status == 'LEFT') handlePaidButtonClick()
                                                                    else handleEditButtonClick(Electric)
                                                                }}>
                                                                    <img src={editLogo} height="5" width={20} className='img-fluid ms-2' />
                                                                    &nbsp;Edit Electricity
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item onClick={() => {
                                                                    if (Electric.Status == 'PAID' || Electric.Status == 'LEFT') handleDownButtonClick(Electric)
                                                                    else toggleModalDown()
                                                                }}>
                                                                    <img src={download} height="5" width={20} className='img-fluid ms-2' />
                                                                    &nbsp;Download
                                                                </Dropdown.Item>
                                                            </DropdownButton>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    )
                                }
                                {
                                    electricity.length == 0 && (
                                        <tbody></tbody>
                                    )
                                }
                            </Table>
                        </Row>
                        {
                            electricity.length == 0 && (
                                <div style={{ marginLeft: '500px' }}>
                                    <p>No Data is Present</p>
                                </div>
                            )
                        }
                    </div>
                </TabItem>
                <TabItem label='Shop Id'>
                    <div style={{ overflowX: 'auto', width: '1250px', marginLeft: '43px' }}>
                        <Row className='mt-2' style={{ width: '1250px' }}>
                            <Table
                                bordered
                                hover
                                responsive
                                size=""
                                striped
                                className='text-center shadow border-2'
                                style={{ backgroundColor: "purple", color: "white" }}
                            >
                                <thead >
                                    <tr>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Current Reading
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Past Reading
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Unit Used
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Paid
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Status
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Paid Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Month Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    tenant.length > 0 && (
                                        <tbody>
                                            {
                                                tenant.map((Electric) => (
                                                    <tr>
                                                        <td scope="row" key={4}>
                                                            {Electric.Month} {Electric.Year}
                                                        </td>
                                                        <td scope="row" key={5}>
                                                            {Electric.Current_Reading}
                                                        </td>
                                                        <td scope="row" key={5}>
                                                            {Electric.Past_Reading}
                                                        </td>
                                                        <td scope="row" key={6}>
                                                            {Electric.Unit_Used}
                                                        </td>
                                                        <td scope="row" key={7}>
                                                            {Electric.Amount}
                                                        </td>
                                                        <td scope="row" key={8}>
                                                            {Electric.Amount_Paid}
                                                        </td>
                                                        <td scope="row" key={9}>
                                                            {Electric.Amount_Left}
                                                        </td>
                                                        <td scope="row" key={10}>
                                                            {Electric.Status}
                                                        </td>
                                                        <td scope="row" key={11}>
                                                            {Electric.Paid_Date}
                                                        </td>
                                                        <td scope="row" key={12}>
                                                            {Electric.Month_Left}
                                                        </td>
                                                        <td scope="row" key={13}>
                                                            <img src={download} height="5" width={20} className='img-fluid ms-2' onClick={() => {
                                                                if (Electric.Status == 'PAID' || Electric.Status == 'LEFT') handleDownButtonClick(Electric)
                                                                else toggleModalDown()
                                                            }} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    )
                                }
                                {
                                    tenant.length == 0 && (
                                        <tbody></tbody>
                                    )
                                }
                            </Table>
                        </Row>
                        {
                            tenant.length == 0 && (
                                <div style={{ marginLeft: '500px' }}>
                                    <p>No Data is Present</p>
                                </div>
                            )
                        }
                    </div>
                </TabItem>
            </Tab>
            <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModal} style={{ background: '#00ffd0' }}>
                    <div style={{ position: 'relative', left: '160px' }}>
                        INFORMATION
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form>
                        <div className="row text-center">
                            <p><b>No Record is Present For Selected Data</b></p>
                        </div>
                        <Container className="text-center">
                            <Button onClick={toggleModal} color="secondary" className="ms-2">Close</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={isOpen1} toggle={toggleModal1} style={{ maxWidth: '800px' }}>
                <ModalHeader toggle={toggleModal1} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '250px' }}>
                        UPDATE ELECTRICITY DETAILS
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form onSubmit={submitForm}>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId" d>Shop Id</Label>
                                <span className="form-control-look">
                                    {data.RentId}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.RentId}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Name</Label>
                                <span className="form-control-look">
                                    {data.Name}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Name}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="currentReading">Current Reading</Label>
                                <span className="form-control-look">
                                    {data.Current_Reading}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Current_Reading}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="status">Past Reading</Label>
                                <span className="form-control-look">
                                    {data.Past_Reading}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Past_Reading}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="originalDate">Unit Used</Label>
                                <span className="form-control-look">
                                    {data.Unit_Used}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Unit_Used}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="status">Amount to be Paid</Label>
                                <span className="form-control-look">
                                    {data.Amount}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Amount}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="originalDate">Original Paid Date</Label>
                                <span className="form-control-look">
                                    {data.Original_Date}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Original_Date}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="status">Status</Label>
                                <span className="form-control-look">
                                    {data.Status}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Status}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="amountLeft">Amount Left</Label>
                                <span className="form-control-look">
                                    {data.Amount_Left}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Amount_Left}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="amountPaid">Amount Paid</Label>
                                <Input
                                    type="text"
                                    placeholder="Amount_Paid"
                                    id="amountPaid"
                                    onChange={(e) => handleChange(e, 'Amount_Paid')}
                                    value={data.Amount_Paid}
                                    invalid={error.errors?.response?.data?.Amount_Paid ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Amount_Paid}</FormFeedback>
                            </FormGroup>
                        </div>
                        <Container className="text-center">
                            <Button color="dark">Update</Button>
                            <Button onClick={completeSubmit} className="ms-2 btn btn-secondary" style={{ background: '#62bd08' }}>Complete</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={isOpenPaid} toggle={toggleModalPaid} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModalPaid} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '160px' }}>
                        INFORMATION
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form>
                        <div className="row text-center">
                            <p>The Electricity is Either Paid or Left for the Month!!</p>
                        </div>
                        <Container className="text-center">
                            <Button onClick={toggleModalPaid} color="secondary" className="ms-2">Close</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={isOpenDown} toggle={toggleModalDown} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModalDown} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '160px' }}>
                        INFORMATION
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form>
                        <div className="row text-center">
                            <p>You can't download unpaid Electric receipt!!</p>
                        </div>
                        <Container className="text-center">
                            <Button onClick={toggleModalDown} color="secondary" className="ms-2">Close</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={isOpenAuth} toggle={toggleModalAuth} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModalAuth} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '160px', color: 'white' }}>
                        INFORMATION
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form>
                        <div className="row text-center">
                            <p>Your Session is expired!! Relogin again</p>
                        </div>
                        <Container className="text-center">
                            <Button onClick={logout} color="secondary" className="ms-2">Logout</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default Electricity