import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody } from 'reactstrap';
import { Button, Container,Col, Row } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Form } from "reactstrap";
import './common.css'
import Graph from './Graph';
import PieChart from './PieChart';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../Services/TenantService';
import { getTotalAmountR } from '../Services/RentServices';
import { getTotalAmountE } from '../Services/ElectricityService';
import { doLogout } from '../AuthServices/Auth';

function Home() {

    const navigate = useNavigate();
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isOpenAuth, setIsOpenAuth] = useState(false);
    const [isCardHovered1, setIsCardHovered1] = useState(false);
    const [isCardHovered2, setIsCardHovered2] = useState(false);
    const [isCardHovered3, setIsCardHovered3] = useState(false);
    const [isCardHovered4, setIsCardHovered4] = useState(false);
    const [isCardHovered5, setIsCardHovered5] = useState(false);
    const [isCardHovered6, setIsCardHovered6] = useState(false);
    const [isCardHovered7, setIsCardHovered7] = useState(false);
    const [totalRent, setTotalRent] = useState(null);
    const [totalElec, setTotalElec] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState('Last 30 days..'); // Default to 30 days
    const [user, setUser] = useState({
        TenantTot: '',
        UnpaidRent: '',
        UnpaidElec: '',
        HalfpaidRent: '',
        HalfpaidElec: '',
        PaidRent: '',
        PaidElec: ''
    })

    const TenantCard = () => {
        navigate("/user/tenant")
    }

    const toggleModalAuth = () => {
        setIsOpenAuth(!isOpenAuth);
    };

    const RentCard = () => {
        navigate("/user/rent")
    }

    const ElectricCard = () => {
        navigate("/user/electricity")
    }

    const fetchDashboard = async (value) => {
        const result = await getDashboard(value);
        if (result == "Unautho")
        {
            if(isOpenAuth == false){setUser({
                TenantTot: '',
                UnpaidRent: '',
                UnpaidElec: '',
                HalfpaidRent: '',
                HalfpaidElec: '',
                PaidRent: '',
                PaidElec: ''
            });toggleModalAuth();}
        }
        else setUser({ ...result.Data });
    }

    const fetchTotRent = async () => {
        const result = await getTotalAmountR();
        if (result == "Unautho")
        {
            if(isOpenAuth == false){setTotalRent(0);toggleModalAuth();}
        }
        else setTotalRent({ ...result.Data })
    }

    const fetchToElec = async () => {
        const result = await getTotalAmountE();
        if (result == "Unautho")
        {
            if(isOpenAuth == false){setTotalElec(0);toggleModalAuth();}
        }
        else setTotalElec({ ...result.Data });
    }

    const handleDurationSelect = (duration, value) => {
        setSelectedDuration(duration);
        fetchDashboard(value);

    };

    useEffect(() => {
        fetchDashboard(1);
        fetchTotRent();
        fetchToElec();
    }, [])

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    return (
        <>
            <Container className="mt-4" style={{ maxWidth: "1400px" }}>
                <Row>
                    <Col>
                        <h2 className='mt-0' style={{ marginLeft: '95px' }}>Dashboard</h2>
                        <p style={{ marginLeft: '98px', fontWeight: '500', color: 'gray' }}>Monthly Statistics</p>
                    </Col>
                    <Col xs={5}></Col>
                    <Col className='mt-3'>
                        <DropdownButton
                            id={`dropdown`}
                            title={selectedDuration}
                            variant={`rounded border-3 text-center ${isButtonHovered} ? button-hover : custom-hover`}
                            style={{ marginLeft: '130px', border: '1px black' }}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                        >
                            <Dropdown.Item onClick={() => handleDurationSelect('Last 30 days', 1)}>
                                Last 30 days
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDurationSelect('3 month', 3)}>
                                3 month
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDurationSelect('6 month', 6)}>
                                6 month
                            </Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <Card
                            className={`border-1 rounded-4 ${isCardHovered1 ? 'card-hover' : 'shadow'}`}
                            onMouseEnter={() => setIsCardHovered1(true)}
                            onMouseLeave={() => setIsCardHovered1(false)}
                            style={{ height: '110px', width: '200px', marginLeft: '90px', background: "white", }}
                            onClick={TenantCard}
                        >
                            <CardBody style={{ cursor: 'pointer' }}>
                                <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Active Tenant</h7>
                                <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }} >{user.TenantTot}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            className={`border-1 rounded-4 ${isCardHovered2 ? 'card-hover' : 'shadow'}`}
                            onMouseEnter={() => setIsCardHovered2(true)}
                            onMouseLeave={() => setIsCardHovered2(false)}
                            style={{ height: '110px', width: '200px', marginLeft: '4px', background: "white", }}
                            onClick={RentCard}
                        >
                            <CardBody style={{ cursor: 'pointer' }}>
                                <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Unpaid Rent</h7>
                                <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{user.UnpaidRent}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            className={`border-1 rounded-4  ${isCardHovered3 ? 'card-hover' : 'shadow'}`}
                            onMouseEnter={() => setIsCardHovered3(true)}
                            onMouseLeave={() => setIsCardHovered3(false)}
                            // style={{ height: '100px', width: '250px', marginLeft: '-100px', background: isCardHovered3 ? "lightblue" : "white", }}
                            style={{ height: '110px', width: '200px', marginLeft: '-30px', background: "white", }}
                        >
                            <CardBody style={{ cursor: 'pointer' }}>
                                <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Halfpaid Rent</h7>
                                <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{user.HalfpaidRent}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            className={`border-1 rounded-4  ${isCardHovered4 ? 'card-hover' : 'shadow'}`}
                            onMouseEnter={() => setIsCardHovered4(true)}
                            onMouseLeave={() => setIsCardHovered4(false)}
                            // style={{ height: '100px', width: '250px', marginLeft: '-100px', background: isCardHovered3 ? "lightblue" : "white", }}
                            style={{ height: '110px', width: '200px', marginLeft: '-63px', background: "white", }}
                            onClick={ElectricCard}
                        >
                            <CardBody style={{ cursor: 'pointer' }}>
                                <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Unpaid Electricity</h7>
                                <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{user.UnpaidElec}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            className={`border-1 rounded-4  ${isCardHovered5 ? 'card-hover' : 'shadow'}`}
                            onMouseEnter={() => setIsCardHovered5(true)}
                            onMouseLeave={() => setIsCardHovered5(false)}
                            // style={{ height: '100px', width: '250px', marginLeft: '-100px', background: isCardHovered3 ? "lightblue" : "white", }}
                            style={{ height: '110px', width: '220px', marginLeft: '-94px', background: "white", }}
                        >
                            <CardBody style={{ cursor: 'pointer' }}>
                                <h7 className='text-uppercase' style={{ fontWeight: '649', color: 'rgb(130, 103, 177)' }}>Halfpaid Electricity</h7>
                                <h4 className='mt-3' style={{ marginLeft: '10px', fontWeight: '400' }}>{user.HalfpaidElec}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className='mt-5'>
                </Row >
            </Container >
            <div style={{ height: '450px' }}>
                <Container
                    className={`rounded-3 border-2 ${isCardHovered6 ? 'card-hover' : 'shadow'}`}
                    style={{ background: 'white', width: '700px', display: 'inline-block', float: 'left', marginLeft: '98px' }}
                    onMouseEnter={() => setIsCardHovered6(true)}
                    onMouseLeave={() => setIsCardHovered6(false)}
                >
                    <Graph rent={totalRent} electricity={totalElec} />
                </Container>
                <Container
                    className={`rounded-3 border-2 ${isCardHovered7 ? 'card-hover' : 'shadow'}`}
                    style={{ background: 'white', width: '400px', display: 'inline-block', marginLeft: '40px' }}
                    onMouseEnter={() => setIsCardHovered7(true)}
                    onMouseLeave={() => setIsCardHovered7(false)}
                >
                    <PieChart user={user} />
                </Container>
            </div>
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
        </>

    )
}

export default Home



