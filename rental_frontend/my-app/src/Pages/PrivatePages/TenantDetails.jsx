import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, Container, Table, Col, Row } from 'reactstrap';
import '../../Components/common.css'
import { useNavigate } from "react-router-dom";
import { getById } from '../../Services/TenantService';
import { useParams } from 'react-router-dom';
import BaseSection from '../../Components/Base';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import arrow from './arrow.png'
import { doLogout } from '../../AuthServices/Auth';

function TenantDetails() {
    const [user, setUser] = useState({
        Advanced: '',
        Advanced_Kiraya: '',
        Bond_End_Date: '',
        Name: '',
        Phone_No: '',
        RentId: '',
        RentM: '',
        Start_Date: '',
        MeterR: ''
    });
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchTenant();
    }, [])

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    async function fetchTenant() {
        const result = await getById(id);
        if(result == "Unautho")
        {
            if(isOpen == false){setUser({
                Advanced: '',
                Advanced_Kiraya: '',
                Bond_End_Date: '',
                Name: '',
                Phone_No: '',
                RentId: '',
                RentM: '',
                Start_Date: '',
                MeterR: ''
            });toggleModal();}
        }
        else setUser({ ...result.Data });
    }

    function GoBack() {
        navigate("/user/tenant")
    }

    function formatNumber(value) {
        if(value==null)return null
        return value.toLocaleString('en-IN');
    }

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    return (
        <BaseSection>
            <Container className="mt-10" style={{ maxWidth: "1400px" }}>
                <Row>
                    <Col>
                        <h2 className='mt-5' style={{ marginLeft: '155px' }}>TENANT DETAILS</h2>
                    </Col>
                    <Col xs={4}></Col>
                    <Col className='mt-5'>
                        <Button
                            color="#d8ccccf8"
                            style={{ width: '100px', height: '35px', background: isButtonHovered ? "lightblue" : "white", marginLeft: '150px' }}
                            className={`custom-button mt-2 ${isButtonHovered ? 'button-hover' : ''}`}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                            onClick={GoBack}
                        >
                            <img src={arrow} height="5" width={17} className='img-fluid mb-1' />
                            &nbsp;&nbsp;Back
                        </Button>
                    </Col>
                </Row>
                <Row className='mt-4' style={{ width: '1000px', marginLeft: '160px' }}>
                    <Card className='shadow'>
                        <CardBody>
                            <Table
                                responsive
                                hover
                                bordered={true}
                                style={{ height: '360px' }}

                            >
                                <tbody>
                                    <tr>
                                        <td className="column-label">Shop ID</td>
                                        <td className="column-value">{user.RentId}</td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">Tenant Name</td>
                                        <td className="column-value">{user.Name}</td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Start Date
                                        </td>
                                        <td className="column-value">
                                            {user.Start_Date}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Rent Per Month
                                        </td>
                                        <td className="column-value">
                                            {formatNumber(user.RentM)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Advanced Kiraya
                                        </td>
                                        <td className="column-value">
                                            {formatNumber(user.Advanced_Kiraya)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Advanced Security
                                        </td>
                                        <td className="column-value">
                                            {formatNumber(user.Advanced)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Bond End Date
                                        </td>
                                        <td className="column-value">
                                            {user.Bond_End_Date}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Phone Number
                                        </td>
                                        <td className="column-value">
                                            {user.Phone_No}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="column-label">
                                            Start Meter Reading
                                        </td>
                                        <td className="column-value">
                                            {user.MeterR}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            {/* <CardFooter className='text-center'>
                                <Button color='warning'>Update Profile</Button>
                            </CardFooter> */}
                        </CardBody>
                    </Card>
                </Row >
                <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '500px' }}>
                <ModalHeader toggle={toggleModal} style={{ background: 'rgb(181 155 227)' }}>
                    <div style={{ position: 'relative', left: '160px',color:'white' }}>
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
            </Container >
        </BaseSection>

    )
}

export default TenantDetails