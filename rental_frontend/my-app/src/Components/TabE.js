import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import './Tab.css';
import { Row, Col, Button, Input } from 'reactstrap';
import SlideButton from './SlideButton';
import { useContext } from 'react';
import { UserContext } from '../Context/userContext';
import { getAllShopId } from '../Services/TenantService';
import { addElectric, updateElectric } from '../Services/ElectricityService';
import YearSelector from './YearSelector';
import plus from './plus.jpg'
import { doLogout } from '../AuthServices/Auth';

const Tab = ({ children }) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { SelectedId, SelectMonth, AddElectric, YearE } = useContext(UserContext);
    const { month: selectedMonth1, updateMonth } = SelectMonth;
    const { Id: shopValue, updateId } = SelectedId
    const { AddE: addE, updateE } = AddElectric;
    const [shopId, setShopId] = useState([]);
    const [isOpenAuth, setIsOpenAuth] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const { yearE: yearE, updateYearE } = YearE;

    // const addNewYear = () => {
    //     const currentDate1 = new Date();
    //     const currentMonth1 = currentDate1.toISOString().slice(0, 7);
    //     let year1 = currentMonth1.slice(0, 4);
    //     var flag = true;
    //     year.forEach((obj) => {
    //         if (obj == year1) { flag = false; return; }
    //     })
    //     if (flag) setYear([...year, year1]);
    // }

    const handleYearChange = (event) => {
        setYear(event.target.value);
        updateYearE(event.target.value);
    };

    useEffect(() => {
        updateYearE(year);
    }, [year]);

    const [data, setData] = useState({
        Amount: '',
        CurrReading: ''
    });

    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    const toggleModal = () => {
        resetData();
        setIsOpen(!isOpen);
    };

    const toggleModalAuth = () => {
        setIsOpenAuth(!isOpenAuth);
    };

    //handle  add form change
    const handleChange = (event, field) => {

        if (field === 'Amount') {
            if (!/^\d*$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only numeric values allowed' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        if (field === 'CurrReading') {
            if (!/^(?:[0-9]+|L)$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only numeric values allowed' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        setData({ ...data, [field]: event.target.value })
    }

    //reseting the form
    const resetData = () => {
        setData({
            Amount: '',
            CurrReading: ''
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

        if (Object.keys(data).length == 2) data['RendId'] = 1;
        //data validation
        if (!/^\d*$/.test(data.Amount)) {
            toast.error("Amount should be Valid!!");
            return;
        }
        if (!/^(?:[0-9]+|L)$/.test(data.CurrReading)) {
            toast.error("Reading should be Valid!!");
            return;
        }
        toggleModal();
        //server call
        addElectric(data)
            .then((result) => {
                toast.success("New Electric Added!!");
                resetData();
                updateE(true);
            })
            .catch(Err => {
                console.log(Err);
                if (Err.response.status == 401 && isOpenAuth == false) toggleModalAuth();
                if (Err.response.status == "400") toast.error("Electricity is already present");
                else toast.error("Error Occur Try After Sometime")
                setError({
                    errors: error,
                    isError: true
                })
            })
    }

    const fetchShopId = async () => {
        const result = await getAllShopId();
        if (result == "Unautho")
        {
            if(isOpenAuth == false){setShopId([]);toggleModalAuth();}
        }
        else setShopId([...result.Data]);
    }

    useEffect(() => {
        fetchShopId();
    }, [])

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const handleMonthChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            return;
        }
        setSelectedMonth(e.target.value);
        updateMonth(e.target.value)
    };

    const fieldChange = (event) => {
        updateId(event.target.value);
    }

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    return (
        <div>
            <div>
                <Row style={{ maxWidth: '1250px', height: '45px', background: 'rgb(190 170 225)', marginLeft: '46px' }} className='rounded-3'>
                    {React.Children.map(children, (child, index) => (
                        <div
                            className={`tab ${activeTab === index ? 'active' : 'inactive'} border-1 rounded-3 text-center mt-2`}
                            onClick={() => handleTabClick(index)}
                            style={{ width: index === 0 ? '100px' : '90px', height: index === 2 ? '5px' : '30px', marginLeft: '7px' }}
                        >
                            <p style={{ marginTop: '-6px' }}>{child.props.label}</p>
                        </div>
                    ))}
                    {activeTab == 1 && (
                        <Col xs={1} className='mt-1 mb-1' style={{ marginLeft: '10px' }}>
                            <Input
                                type="select"
                                id="shopId"
                                className="rounded-1"
                                style={{ width: '207px', maxHeight: '35px', background: 'white', border: '1px solid black', cursor: 'pointer' }}
                                name="selectId"
                                onChange={fieldChange}
                                defaultValue={0}
                            >
                                {
                                    shopId.map((tenant) => (
                                        <option value={tenant.shopId}>
                                            {tenant.shopId}&nbsp;&nbsp;&nbsp;&nbsp;{tenant.name}
                                        </option>
                                    ))
                                }
                            </Input>
                        </Col>
                    )}
                    <Col xs={5}></Col>
                    {
                        activeTab == 1 && (
                            <>
                                <Col className='mt-2'>
                                    <div>
                                        <b>Select Year :</b> &nbsp;<YearSelector selectedYear={year} onChange={handleYearChange} />

                                    </div>
                                </Col>

                            </>
                        )
                    }
                    {activeTab == 1 && (
                        <Col xs={0} className='mt-1'>
                        </Col>
                    )}
                    {activeTab == 0 && (
                        <Col xs={2} className='month-selector'>
                            <Input
                                bsSize=""
                                type="month"
                                className='mt-2 form-control-look'
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                disabledFuture
                                style={{ width: '170px', height: '25px', backgroundColor: 'white', cursor: 'pointer' }}
                            />
                        </Col>
                    )} {/* Empty column to fill the space */}
                    {activeTab == 0 && (
                        <Col xs='auto' className='d-flex justify-content-end'>
                            <Button color='#d8ccccf8' style={{ width: '150px', height: '35px', background: 'white' }} className="custom-button mt-1 mb-1" onClick={toggleModal} >
                                <img src={plus} height="5" width={15} className='img-fluid mb-1' />
                                &nbsp;Add Electricity
                            </Button>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="tab-content">
                {React.Children.toArray(children)[activeTab]}
            </div>
            <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '800px' }}>
                <ModalHeader toggle={toggleModal} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '320px' }}>
                        ADD ELECTRIC
                    </div>
                </ModalHeader>
                <ModalBody>
                    {/*Name Field*/}
                    <Form onSubmit={submitForm}>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="rentId">Shop Id</Label>
                                <Input
                                    type="select"
                                    id="shopId"
                                    className="rounded-1"
                                    name="selectId"
                                    onChange={(e) => handleChange(e, 'RendId')}
                                    defaultValue={0}
                                >
                                    {
                                        shopId.map((tenant) => (
                                            <option value={tenant.shopId}>
                                                {tenant.shopId}&nbsp;&nbsp;&nbsp;&nbsp;{tenant.name}
                                            </option>
                                        ))
                                    }
                                </Input>
                                <FormFeedback>{error.errors?.response?.data?.RentId}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="reading">Current Reading</Label>
                                <Input
                                    type="text"
                                    placeholder="Reading"
                                    id="reading"
                                    onChange={(e) => handleChange(e, 'CurrReading')}
                                    value={data.CurrReading}
                                    invalid={error.errors?.response?.data?.CurrReading ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.CurrReading}</FormFeedback>
                            </FormGroup>
                        </div>
                        <div className='row'>
                            <FormGroup className="col-md-6">
                                <Label for="name">Amount Paid</Label>
                                <Input
                                    type="text"
                                    placeholder="Amount"
                                    id="amount"
                                    onChange={(e) => handleChange(e, 'Amount')}
                                    value={data.Amount}
                                    invalid={error.errors?.response?.data?.Amount ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.Amount}</FormFeedback>
                            </FormGroup>
                        </div>
                        <Container className="text-center">
                            <Button style={{background: '#9f57e1'}}>Add</Button>
                            <Button onClick={resetData} color="secondary" type="reset" className="ms-2">Reset</Button>
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
        </div>
    );
};

export default Tab;
