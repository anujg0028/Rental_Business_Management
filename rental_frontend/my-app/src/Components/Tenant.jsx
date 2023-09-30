import React, { useEffect, useState, useRef } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody } from 'reactstrap';
import { Button, Container, Table, Col, Row } from 'reactstrap';
import { addTenant, deleteATenant, getAllUser, getTotalAvanced, getTotalRent, updateTenant } from '../Services/TenantService';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import editLogo from './edit.jpg';
import dot from './dot.png';
import eye from './eyeLogo.png';
import del from './deleteLogo.png'
import plus from './plus.jpg'
import './common.css'
import { useNavigate } from "react-router-dom";
import { doLogout } from '../AuthServices/Auth';

function Tenant() {

    const [user, setUser] = useState([]);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [totalRent, setTotalRent] = useState(null);
    const [totalAdvanced, setTotalAdvanced] = useState(null);
    const [isCardHovered1, setIsCardHovered1] = useState(false);
    const [isCardHovered2, setIsCardHovered2] = useState(false);
    const [isCardHovered3, setIsCardHovered3] = useState(false);

    const navigate = useNavigate();

    const toggleModalAdd = () => {
        resetData();
        setIsOpenAdd(!isOpenAdd);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleModalEdit = () => {
        setIsOpenEdit(!isOpenEdit);
    };

    //setData name is writen in camel case i.e if user is writen then we write setUser
    const [data, setData] = useState({
        Advanced: '',
        Advanced_Kiraya: '',
        Bond_End_Date: '',
        Name: '',
        Phone_No: '',
        RentId: '',
        RentM: '',
        Start_Date: '',
        MeterR: '',
        RentDate : ''
    });

    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    //handle  add form change
    const handleChange = (event, field) => {

        if (field === 'RentId' || field === 'Advanced' || field === 'Advanced_Kiraya' || field === 'Phone_No' || field === 'RendM') {
            if (!/^\d*$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only numeric values allowed' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        if (field === 'Name') {
            if (!/^[a-zA-Z\s]*$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only alphabets allowed' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        setData({ ...data, [field]: event.target.value })
    }

    //reseting the form
    const resetData = () => {
        setData({
            Advanced: '',
            Advanced_Kiraya: '',
            Bond_End_Date: '',
            Name: '',
            Phone_No: '',
            RentId: '',
            RentM: '',
            Start_Date: '',
            MeterR: '',
            RentDate : ''
        })
    };

    //submitting the form
    const submitForm = (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        //data validation
        if (data.Start_Date > data.Bond_End_Date) {
            toast.error("Start Date can't be greater than Bond End Date!!");
            return;
        }
        if (!/^\d*$/.test(data.RentId) || !/^\d*$/.test(data.Advanced) || !/^\d*$/.test(data.Advanced_Kiraya) || !/^\d*$/.test(data.Phone_No) || !/^\d*$/.test(data.RentM)) {
            toast.error("Entered Correct Details!!");
            return;
        }
        if (!/^[a-zA-Z\s]*$/.test(data.Name)) {
            toast.error("Name can't have numbers");
            return;
        }
        let flag = false;
        user.forEach((tenant) => {
            if (tenant.RentId == data.RentId) {
                flag = true;
                return;
            }
        })
        if (flag) {
            toast.error("Shop Id is Already Present!!");
            return;
        }

        toggleModalAdd();
        //server call
        addTenant(data)
            .then((result) => {
                toast.success("Tenant is Added");
                fetchTenant();
                resetData();
            })
            .catch(Err => {
                console.log(Err);
                if(Err.response.status == '401' && isOpen == false)toggleModal();
                if (Err.response.status == "400") toast.error("Tenant is already present!!");
                else toast.error("Error Occur Try After Sometime")
                setError({
                    errors: error,
                    isError: true
                })
            })
    }

    const handleEditButtonClick = (tenant) => {
        console.log(tenant)
        setData({
            Advanced: tenant.Advanced,
            Advanced_Kiraya: tenant.Advanced_Kiraya,
            Bond_End_Date: tenant.Bond_End_Date,
            Name: tenant.Name,
            Phone_No: tenant.Phone_No,
            RentId: tenant.RentId,
            RentM: tenant.RentM,
            Start_Date: tenant.Start_Date,
            MeterR: tenant.MeterR,
            RentDate : tenant.RentDate
        });
        setIsOpenEdit(!isOpenEdit);
    };

    const submitUpdateForm = (event) => {
        event.preventDefault();
        console.log(data)

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        //data validation
        if (data.Start_Date > data.Bond_End_Date) {
            toast.error("Start Date can't be greater than Bond End Date!!");
            return;
        }
        if (!/^\d*$/.test(data.RentM)) {
            toast.error("Rent Should be Number!!");
            return;
        }
        toggleModalEdit();
        updateTenant(data)
            .then((result) => {
                console.log(result);
                toast.success("Tenant is Updated");
                fetchTenant();
                resetData();
            })
            .catch(Err => {
                console.log(Err);
                if(Err.response.status == '401' && isOpen == false)toggleModal();
                toast.error("Error Occur Try After Sometime")
                setError({
                    errors: error,
                    isError: true
                })
            })
    }


    useEffect(() => {
        fetchTenant();
        fetchTotRent();
        fetchTotAdvanced();
    }, [])

    async function fetchTenant() {
        const result = await getAllUser();
        console.log(result)
        if (result == "Unautho")
        {
            if(isOpen == false){setUser([]);toggleModal();}
        }
        else setUser([...result.Data]);
    }

    async function fetchTotRent() {
        const result = await getTotalRent();
        if (result == "Unautho")
        {
            if(isOpen == false){setTotalRent(0);toggleModal();}
        }
        else setTotalRent(result.Data);
    }

    async function fetchTotAdvanced() {
        const result = await getTotalAvanced()
        if (result == "Unautho")
        {
            if(isOpen == false){setTotalAdvanced(0);toggleModal();}
        }
        else setTotalAdvanced(result.Data);
    }

    async function handleDeleteTenant(id) {
        toast.success("Tenant Deleted!!")
        await deleteATenant(id);
        fetchTenant();
    }

    const handleViewDetailsClick = (tenant) => {
        navigate(`/user/tenant/details/${tenant.RentId}`)
    };

    function formatNumber(value) {
        if (value == null) return null
        return value.toLocaleString('en-IN');
    }

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    return (
        <Container className="mt-5" style={{ maxWidth: "1400px" }}>
            <Row>
                <Col>
                    <h2 className='mt-0' style={{ marginLeft: '150px' }}>TENANT</h2>
                    {/* <p style={{ marginLeft: '150px' }}><b>Total Active Tenant : {user.length} </b></p> */}
                </Col>
                <Col xs={5}></Col>
                <Col className='mt-0'>
                    <Button
                        color='#d8ccccf8'
                        style={{ width: '130px', height: '35px', background: 'white', marginLeft: '90px' }}
                        className={`custom-button mt-0 ${isButtonHovered ? 'button-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        onClick={toggleModalAdd}
                    >
                        <img src={plus} height="5" width={15} className='img-fluid mb-1' />
                        &nbsp;Add Tenant
                    </Button>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                    <Card
                        className={`border-1 rounded-4 ${isCardHovered1 ? 'card-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsCardHovered1(true)}
                        onMouseLeave={() => setIsCardHovered1(false)}
                        style={{ height: '100px', width: '250px', marginLeft: '230px', background: "white", }}
                    >
                        <CardBody style={{ cursor: 'pointer' }}>
                            <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Active Tenant</h7>
                            <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }} >{user.length}</h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card
                        className={`border-1 rounded-4 ${isCardHovered2 ? 'card-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsCardHovered2(true)}
                        onMouseLeave={() => setIsCardHovered2(false)}
                        style={{ height: '100px', width: '250px', marginLeft: '20px', background: "white", }}
                    >
                        <CardBody style={{ cursor: 'pointer' }}>
                            <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Total Rent Per Month</h7>
                            <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{formatNumber(totalRent)}</h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card
                        className={`border-1 rounded-4  ${isCardHovered3 ? 'card-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsCardHovered3(true)}
                        onMouseLeave={() => setIsCardHovered3(false)}
                        // style={{ height: '100px', width: '250px', marginLeft: '-100px', background: isCardHovered3 ? "lightblue" : "white", }}
                        style={{ height: '100px', width: '250px', marginLeft: '-100px', background: "white", }}
                    >
                        <CardBody style={{ cursor: 'pointer' }}>
                            <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Total Advanced</h7>
                            <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{formatNumber(totalAdvanced)}</h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className='mt-5'>
                <Container style={{ width: '1070px' }}>
                    <Table
                        bordered
                        hover
                        striped
                        responsive
                        size=""
                        className='text-center shadow bordered-3'
                        style={{ backgroundColor: "purple", color: "white" }}
                    >
                        <thead >
                            <tr>
                                <th style={{ background: 'rgb(181 155 227)' }}>
                                    Shop Id
                                </th>
                                <th style={{ background: 'rgb(181 155 227)' }}>
                                    Name
                                </th>
                                <th style={{ background: 'rgb(181 155 227)' }}>
                                    Rent/M
                                </th>
                                <th style={{ background: 'rgb(181 155 227)' }}>
                                    Phone No
                                </th>
                                <th style={{ background: 'rgb(181 155 227)' }}>
                                    Bond End Date
                                </th>
                                <th style={{ background: 'rgb(181 155 227)', width: '100px' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.map((tenant, index) => (
                                    <tr>
                                        <td scope="row" key={1}>
                                            {tenant.RentId}
                                        </td>
                                        <td scope="row" key={2}>
                                            {tenant.Name}
                                        </td>
                                        <td scope="row" key={4}>
                                            {tenant.RentM}
                                        </td>
                                        <td scope="row" key={7}>
                                            {tenant.Phone_No}
                                        </td>
                                        <td scope="row" key={8}>
                                            {tenant.Bond_End_Date}
                                        </td>
                                        <td scope="row" key={9}>
                                            {/* <img src={editLogo} height="5" width={20} className='img-fluid ms-2' onClick={() => handleEditButtonClick(tenant)} /> */}
                                            {/* <img src={dot} height="5" width={20} className='img-fluid ms-2'/> */}
                                            <DropdownButton
                                                id={`dropdown-${tenant.RentId}`}
                                                title={<img src={dot} width={20} />}
                                                variant="transparent custom-dropdown-button"
                                            >
                                                <Dropdown.Item onClick={() => handleViewDetailsClick(tenant)}>
                                                    <img src={eye} height="5" width={20} className='img-fluid ms-2' />
                                                    &nbsp;View Details
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleEditButtonClick(tenant)}>
                                                    <img src={editLogo} height="5" width={20} className='img-fluid ms-2' />
                                                    &nbsp;Edit Tenant
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item onClick={() => handleDeleteTenant(tenant.RentId)}>
                                                    <img src={del} height="5" width={20} className='img-fluid ms-2' />
                                                    &nbsp;Delete Tenant
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Container>
            </Row >
            <Modal isOpen={isOpenAdd} toggle={toggleModalAdd} style={{ maxWidth: '800px' }}>
                <ModalHeader toggle={toggleModalAdd} style={{ background: 'rgb(181 155 227)' }}>
                    <div className='text-center' style={{ position: 'relative', left: '320px' }}>
                        ADD TENANT
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form onSubmit={submitForm}>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Shop Id</Label>
                                <Input
                                    type="text"
                                    placeholder="RentId"
                                    id="rentId"
                                    onChange={(e) => handleChange(e, 'RentId')}
                                    value={data.RentId}
                                    invalid={error.errors?.response?.data?.RentId ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.RentId}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    id="name"
                                    onChange={(e) => handleChange(e, 'Name')}
                                    value={data.Name}
                                    invalid={error.errors?.response?.data?.Name ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Name}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Start Date</Label>
                                <Input
                                    type="date"
                                    placeholder="DD/MM/YYYY"
                                    id="startDate"
                                    onChange={(e) => handleChange(e, 'Start_Date')}
                                    value={data.Start_Date}
                                    invalid={error.errors?.response?.data?.Start_Date ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Start_Date}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Advanced</Label>
                                <Input
                                    type="text"
                                    placeholder="Advanced"
                                    id="advanced"
                                    onChange={(e) => handleChange(e, 'Advanced')}
                                    value={data.Advanced}
                                    invalid={error.errors?.response?.data?.Advanced ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Advanced}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Advanced Rent</Label>
                                <Input
                                    type="text"
                                    placeholder="Advanced Rent"
                                    id="advancedRent"
                                    onChange={(e) => handleChange(e, 'Advanced_Kiraya')}
                                    value={data.Advanced_Kiraya}
                                    invalid={error.errors?.response?.data?.Advanced_Kiraya ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Advanced_Kiraya}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Rent Per Month</Label>
                                <Input
                                    type="text"
                                    placeholder="Rent/M"
                                    id="rentM"
                                    onChange={(e) => handleChange(e, 'RentM')}
                                    value={data.RentM}
                                    invalid={error.errors?.response?.data?.RentM ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.RentM}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Bond End Date</Label>
                                <Input
                                    type="date"
                                    placeholder="DD/MM/YYYY"
                                    id="bondEndDate"
                                    onChange={(e) => handleChange(e, 'Bond_End_Date')}
                                    value={data.Bond_End_Date}
                                    invalid={error.errors?.response?.data?.Bond_End_Date ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Bond_End_Date}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Phone Number</Label>
                                <Input
                                    type="text"
                                    placeholder="Phone Number"
                                    id="phoneNo"
                                    onChange={(e) => handleChange(e, 'Phone_No')}
                                    value={data.Phone_No}
                                    invalid={error.errors?.response?.data?.Phone_No ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Phone_No}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="meterR">Meter Starting Reading</Label>
                                <Input
                                    type="number"
                                    placeholder="Meter Reading"
                                    id="meterR"
                                    onChange={(e) => handleChange(e, 'MeterR')}
                                    value={data.MeterR}
                                    invalid={error.errors?.response?.data?.MeterR ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.MeterR}</FormFeedback>
                            </FormGroup>
                        </div>
                        <Container className="text-center">
                            <Button style={{background: '#9f57e1'}}>Register</Button>
                            <Button onClick={resetData} color="secondary" type="reset" className="ms-2">Reset</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            {/*  Edit Modal */}
            <Modal isOpen={isOpenEdit} toggle={toggleModalEdit} style={{ maxWidth: '800px' }}>
                <ModalHeader toggle={toggleModalEdit} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '310px' }}>
                        UPDATE TENANT
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form onSubmit={submitUpdateForm}>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Shop Id</Label>
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
                                <Label for="rentId">Start Date</Label>
                                <span className="form-control-look">
                                    {data.Start_Date}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Start_Date}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Advanced</Label>
                                <span className="form-control-look">
                                    {data.Advanced}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Advanced}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Advanced Rent</Label>
                                <span className="form-control-look">
                                    {data.Advanced_Kiraya}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Advanced_Kiraya}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Rent Per Month</Label>
                                <Input
                                    type="text"
                                    placeholder="Rent/M"
                                    id="rentM"
                                    onChange={(e) => handleChange(e, 'RentM')}
                                    value={data.RentM}
                                    invalid={error.errors?.response?.data?.RentM ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.RentM}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Bond End Date</Label>
                                <Input
                                    type="date"
                                    placeholder="DD/MM/YYYY"
                                    id="bondEndDate"
                                    onChange={(e) => handleChange(e, 'Bond_End_Date')}
                                    value={data.Bond_End_Date}
                                    invalid={error.errors?.response?.data?.Bond_End_Date ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Bond_End_Date}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="name">Phone Number</Label>
                                <span className="form-control-look">
                                    {data.Phone_No}
                                </span>
                                <FormFeedback>{error.errors?.response?.data?.Phone_No}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="name">Meter Reading</Label>
                                <Input
                                    type="number"
                                    placeholder="Meter Reading"
                                    id="meterR"
                                    onChange={(e) => handleChange(e, 'MeterR')}
                                    value={data.MeterR}
                                    invalid={error.errors?.response?.data?.MeterR ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.MeterR}</FormFeedback>
                            </FormGroup>
                        </div>
                        <Container className="text-center">
                            <Button color="dark">Update</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModal} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '160px', color: 'white' }}>
                        INFORMATION
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form>
                        <div className="row text-center">
                            <p>Your Session is expired!! Re-Login again</p>
                        </div>
                        <Container className="text-center">
                            <Button onClick={logout} color="secondary" className="ms-2">Logout</Button>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
        </Container >

    )
}

export default Tenant



