import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody, Container, Row, Col, Table } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { toast } from 'react-toastify';
import './common.css'
import Tab from './TabR'
import TabItem from './TabItem';
import { useContext } from 'react';
import { UserContextR } from '../Context/userContext';
import { getAll, getAllByMonth, getById, getTotalRent, updateRent } from '../Services/RentServices';
import editLogo from './edit.jpg'
import download from './download.png';
import dot from './dot.png';
import { useNavigate } from 'react-router-dom';
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

function Rent() {
    const monthArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const navigate = useNavigate();
    const [rent, setRent] = useState([]);
    const [tenant, setTenant] = useState([]);
    const { SelectedId, SelectMonth, AddRent, YearR } = useContext(UserContextR);
    const { addRent: addR, updateAddRent } = AddRent;
    const { yearR: yearR, updateYearR } = YearR;
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAuth, setIsOpenAuth] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpenPaid, setIsOpenPaid] = useState(false);
    const [isOpenDown, setIsOpenDown] = useState(false);
    const [isCardHovered1, setIsCardHovered1] = useState(false);
    const [isCardHovered2, setIsCardHovered2] = useState(false);
    const [isCardHovered3, setIsCardHovered3] = useState(false);
    const [totalRent, setTotalRent] = useState({
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
        Year: ''
    });

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
            Year: ''
        })
    };

    const toggleModal1 = () => {
        setIsOpen1(!isOpen1);
    };

    const toggleModalAuth = () => {
        setIsOpenAuth(!isOpenAuth);
    };

    //submitting the form
    const submitForm = async (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        if (!/^\d*$/.test(data.Amount_Paid)) {
            toast.error("Amount Should be Valid!!");
            return;
        }
        toggleModal1();
        //server call
        const aa = await updateRent(data);
        if (aa == "Unautho"){
            if(isOpenAuth == false) toggleModalAuth();
        }
        toast.success("Rent Updated!")
        resetData();
        fetchAll();
        fetchAllById();
        fetchToatlRent();
    }

    const handleEditButtonClick = (rent) => {
        setData({
            Original_Date: rent.Original_Date,
            Amount_Left: rent.Amount_Left,
            Amount_Paid: rent.Amount_Paid,
            Name: rent.Name,
            Status: rent.Status,
            RentId: rent.RentId,
            Paid_Date: rent.Paid_Date,
            Month: rent.Month,
            Year: rent.Year
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
        const aa = await updateRent(data, 'Complete');
        if (aa == "Unautho"){
            if(isOpenAuth == false) toggleModalAuth();
        }
        toast.success("Rent Completed!")
        resetData();
        fetchAll();
        fetchAllById();
        fetchToatlRent();
    }

    const fetchAll = async () => {
        let year = SelectMonth.month.slice(0, 4);
        let month = monthArr[parseInt(SelectMonth.month.slice(5))]
        const result = await getAllByMonth(month, year);
        console.log(result)
        if (result == "Unautho"){
            console.log("11")
            setRent([]);toggleModalAuth();
        }
        else{
        if (result.Data.length > 0) setRent([...result.Data]);
        else { setRent([]); console.log(isOpen); toggleModal(); }
        if (AddRent.addRent) updateAddRent(false);
        }
    }

    const fetchToatlRent = async () => {
        let year = SelectMonth.month.slice(0, 4);
        let month = monthArr[parseInt(SelectMonth.month.slice(5))]
        const result = await getTotalRent(month, year);
        console.log(result)
        if (result == "Unautho"){
            console.log("12")
            setTotalRent({
            Total: '',
            UPTot: '',
            HPTot: ''
        });toggleModalAuth();
    }
        else {setTotalRent({ ...result.Data });}
    }

    if (AddRent.addRent) { fetchAll(); fetchToatlRent(); }

    const fetchAllById = async () => {
        const result = await getById(SelectedId.Id, YearR.yearR);
        console.log(result)
        if (result == "Unautho"){
            setTenant([]);toggleModalAuth();
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

    useEffect(() => {
        fetchAll();
        fetchToatlRent();
    }, [SelectMonth.month])

    useEffect(() => {
        //console.log(tenant)
        if (tenant.length == 0) fetchAllById();
        if (tenant.length > 0 && tenant[0].Year != YearR.yearR) fetchAllById();
    }, [YearR.yearR])

    useEffect(() => {
        fetchAllById();
    }, [SelectedId.Id])

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleModalPaid = () => {
        setIsOpenPaid(!isOpenPaid);
    };

    const toggleModalDown = () => {
        setIsOpenDown(!isOpenDown);
    };

    const handlePaidButtonClick = () => {
        setIsOpenPaid(!isOpenPaid);
    };

    function formatNumber(value) {
        if (value == null) return null
        return value.toLocaleString('en-IN');
    }

    function handleDownButtonClick(rent) {
        navigate(`/user/download/rent/${rent.RentId}/month/${rent.Month}/year/${rent.Year}/receipt`)
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
                <TabItem label='Rent'>
                    <Container className='mt-3'>
                        <Row>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4 ${isCardHovered1 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered1(true)}
                                    onMouseLeave={() => setIsCardHovered1(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '150px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Rent Collected</h7>
                                        <h4 className='mt-3' style={{ fontWeight: '400' }} >{formatNumber(totalRent.Total)}</h4>
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
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Unpaid Rent</h7>
                                        <h4 className='mt-3' style={{ fontWeight: '400' }}>{totalRent.UPTot}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className={`border-1 rounded-4  ${isCardHovered3 ? 'card-hover' : 'shadow'}`}
                                    onMouseEnter={() => setIsCardHovered3(true)}
                                    onMouseLeave={() => setIsCardHovered3(false)}
                                    style={{ height: '100px', width: '250px', marginLeft: '-64px', background: "white", }}
                                >
                                    <CardBody style={{ cursor: 'pointer' }}>
                                        <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Half Paid Rent</h7>
                                        <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{totalRent.HPTot}</h4>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    <div className='mt-5' style={{ overflowX: 'auto', width: '1200px', marginLeft: '65px' }}>
                        <Row className='mt-1' style={{ width: '1200px' }}>
                            <Table
                                bordered
                                hover
                                responsive
                                size=""
                                striped
                                className='text-center shadow border-2'
                                style={{ backgroundColor: "#d8ccccf8", color: "#d8ccccf8" }}
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
                                            Amount Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Paid
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Paid Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Status
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    rent.length > 0 && (
                                        <tbody>
                                            {
                                                rent.map((Rent) => (
                                                    <tr>
                                                        <td scope="row" key={2}>
                                                            {Rent.Name}
                                                        </td>
                                                        <td scope="row" key={3}>
                                                            {Rent.Original_Date}
                                                        </td>
                                                        <td scope="row" key={8}>
                                                            {Rent.Amount_Left}
                                                        </td>
                                                        <td scope="row" key={9}>
                                                            {Rent.Amount_Paid}
                                                        </td>
                                                        <td scope="row" key={11}>
                                                            {Rent.Paid_Date}
                                                        </td>
                                                        <td scope="row" key={10}>
                                                            {Rent.Status}
                                                        </td>
                                                        <td scope="row" key={13}>
                                                            {/* <img src={editLogo} height="5" width={20} className='img-fluid ms-2' onClick={() => {
                                                                if (Rent.Status == 'PAID') handlePaidButtonClick()
                                                                else handleEditButtonClick(Rent)
                                                            }} /> */}
                                                            <DropdownButton
                                                                id={`dropdown-${tenant.RentId}`}
                                                                title={<img src={dot} width={20} />}
                                                                variant="transparent custom-dropdown-button"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    if (Rent.Status == 'PAID') handlePaidButtonClick()
                                                                    else handleEditButtonClick(Rent)
                                                                }}>
                                                                    <img src={editLogo} height="5" width={20} className='img-fluid ms-2' />
                                                                    &nbsp;Edit Rent
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item onClick={() => {
                                                                    if (Rent.Status == 'PAID') handleDownButtonClick(Rent)
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
                                    rent.length == 0 && (
                                        <tbody></tbody>
                                    )
                                }
                            </Table>
                        </Row>
                        {
                            rent.length == 0 && (
                                <div style={{ marginLeft: '500px' }}>
                                    <p>No Data is Present</p>
                                </div>
                            )
                        }
                    </div>
                </TabItem>
                <TabItem label='Shop Id'>
                    <div className='rounded-2 border-1' style={{ overflowX: 'auto', width: '1250px', marginLeft: '42px' }}>
                        <Row className='mt-2 rounded-3 border-2' style={{ width: '1250px' }}>
                            <Table
                                bordered
                                hover
                                responsive
                                size=""
                                striped
                                className='text-center shadow border-2 rounded-1'
                                style={{ backgroundColor: "purple", color: "white" }}
                            >
                                <thead >
                                    <tr>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Original Pay Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Paid
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Amount Left
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Paid Date
                                        </th>
                                        <th style={{ background: 'rgb(181 155 227)' }}>
                                            Status
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
                                                tenant.map((rent) => (
                                                    <tr>
                                                        <td scope="row" key={4}>
                                                            {rent.Month} {rent.Year}
                                                        </td>
                                                        <td scope="row" key={5}>
                                                            {rent.Original_Date}
                                                        </td>
                                                        <td scope="row" key={8}>
                                                            {rent.Amount_Paid}
                                                        </td>
                                                        <td scope="row" key={9}>
                                                            {rent.Amount_Left}
                                                        </td>
                                                        <td scope="row" key={11}>
                                                            {rent.Paid_Date}
                                                        </td>
                                                        <td scope="row" key={10}>
                                                            {rent.Status}
                                                        </td>
                                                        <td scope="row" key={11}>
                                                            <img src={download} height="5" width={20} className='img-fluid ms-2' onClick={() => {
                                                                if (rent.Status == 'PAID') handleDownButtonClick(rent)
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
                    </div>
                    {
                        tenant.length == 0 && (
                            <div style={{ marginLeft: '600px' }}>
                                <p>No Data is Present</p>
                            </div>
                        )
                    }
                </TabItem>
            </Tab>
            <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModal} style={{ background: 'rgb(181 155 227)' }}>
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
                    <div style={{ position: 'relative', left: '310px' }}>
                        UPDATE RENT
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
                            <p>The Rent is Already Paid!!</p>
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
                            <p>You can't download unpaid rent receipt!!</p>
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

export default Rent
