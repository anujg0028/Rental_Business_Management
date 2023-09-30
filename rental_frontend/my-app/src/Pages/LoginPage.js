import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, FormFeedback } from "reactstrap";
import BaseSection from "../Components/Base";
import { useState } from "react";
import { toast } from "react-toastify";
import { login, sendotp } from "../Services/users-service";
import { doLogin } from "../AuthServices/Auth";
import { useNavigate } from "react-router-dom";
import backgroundImage from './home-background.jpg';
import email_area from '../Components/email_texr.jpg';
import eyeOpen from './eyeOpen.png';
import eyeClose from './eyeClose.png'
import './Login.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Login = () => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenVerify, setIsOpenVerify] = useState(false);
    const [isOpenPass, setIsOpenPass] = useState(false);
    const [otp, setOTP] = useState("");
    const [loginDetail, setLoginDetail] = useState({
        username: '',
        password: ''
    })
    const [data, setData] = useState({
        username: '',
        otp: '',
        password: '',
        ConfPassword: ''
    });
    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    const toggleModal = () => {
        if (!isOpen) {
            setData({
                username: '',
                otp: '',
                password: '',
                ConfPassword: ''
            })
        }
        setIsOpen(!isOpen);
    };

    const toggleModalVerify = () => {
        setIsOpenVerify(!isOpenVerify);
    };

    const toggleModalPass = () => {
        setIsOpenPass(!isOpenPass);
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (event, field) => {
        setLoginDetail({ ...loginDetail, [field]: event.target.value })
    }

    //handle  add form change
    const handleChangeForgotten = (event, field) => {
        if (field === 'username') {
            if (!/^\w+@gmail\.com$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Email is invalid' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        if (field === 'otp') {
            if (event.target.value.trim() !== '' && !/^[\d]+$/.test(event.target.value)) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only numbers are allowed' } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        if (field === 'ConfPassword' && data.password.length == event.target.value.length) {
            if (data.password != event.target.value) {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: `Password does't match` } } }, isError: true });
            } else {
                setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
            }
        }
        setData({ ...data, [field]: event.target.value })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault(); //stop the default behaviour of the form i.e after clicking submit the form does not close
        if (loginDetail.username.trim() === '' || loginDetail.password.trim() === '') {
            toast.error("Username and password both are mandatory");
            return;
        }
        //sending data to server to generate jwt token
        login(loginDetail).then((jwtToken) => {

            //save the data to localStorage
            doLogin(jwtToken, () => {
                //redirect to user dasboard
                navigate("/user/home")
            })
            toast.success("user is login");
        })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) toast.error("Username and password is invalid")
                if (error.response.status === 404) toast.error("User is not present with the given username")
            })
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    function goToSignUp() {
        navigate("/signup")
    }

    const submitForgotten = async (event) => {
        event.preventDefault();
        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        if (!/^\w+@gmail\.com$/.test(data.username)) {
            toast.error("Email is invalid!!");
            return;
        }
        if (data.username.trim() === '') {
            toast.error("Please enter username");
            return;
        }
        toggleModalVerify();
        toggleModal();
        const otp = await sendotp(data.username);
        if (otp) toast.success("OTP send succefully!!")
        setOTP(otp);
    }

    const resendOTP = async () => {
        toast.success("OTP resend succefully!!")
        console.log(data.username)
        const otp = await sendotp(data.username);
        setOTP(otp);
    }

    const submitverify = (event) => {
        event.preventDefault();
        if (!/^\d{4}$/.test(data.otp)) {
            toast.error("Invalid OTP");
            return;
        }
        if (data.otp.trim() === '') {
            toast.error("Please enter OTP");
            return;
        }
        if (parseInt(data.otp) == parseInt(otp)) {
            toast.success("OTP verfied");
            toggleModalVerify();
            toggleModalPass();
        }
        else {
            toast.error("Wrong OTP")
        }
    }

    const submitPassChange = (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        if (data.password != data.ConfPassword) {
            toast.error("Config Password does't Match!!");
            return;
        }
        if (data.password.trim() === '' || data.ConfPassword.trim() === '') {
            toast.error("Please enter Password");
            return;
        }
        toast.success("Password Change Successfully")
        toggleModalPass();
    }

    return (
        <BaseSection>
            <Container
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: '100% 100%', // Stretch the background image to cover the whole Container
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '89vh', // Stretch the Container to cover the whole page vertically
                    maxWidth: '100vw', // Stretch the Container to cover the whole page horizontally
                    margin: 0, // Remove default margin
                    padding: 0, // Remove default padding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Row className="mt-0">
                    <div className="d-flex justify-content-end mt-3" style={{ position: 'relative', top: '-20px', left: '60px' }}>
                        <h4>Welcome to Rental Shops</h4>
                    </div>
                    <Col sm={6} md={{ size: 4, offset: 7 }}>
                        <Card
                            className="blur-background" // Set the width and height to 100%
                            style={{
                                width: "400px", // Set the maximum width of the card
                                height: "410px", // Set the maximum height of the card
                            }}
                        >
                            <CardHeader className="text-center">
                                <h3>Sign In</h3>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleFormSubmit}>
                                    {/*Email Field*/}
                                    <FormGroup>
                                        <Label for="email" style={{ fontWeight: "500" }}>
                                            Email
                                        </Label>
                                        <div className='form-control-wrap'>
                                            <div className="input-with-image">
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your Email"
                                                    id="email"
                                                    onChange={(e) => handleChange(e, 'username')}
                                                    value={loginDetail.username}
                                                />
                                                <img src={email_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                                            </div>
                                        </div>
                                    </FormGroup>
                                    {/*Password Field*/}
                                    <FormGroup>
                                        <Label for="password" style={{ fontWeight: '500' }}>
                                            Password
                                        </Label>
                                        <div className='form-control-wrap'>
                                            <div className="input-with-image">
                                                <Input
                                                    type={passwordVisible ? "text" : "password"}
                                                    placeholder="Enter your Password"
                                                    id="password"
                                                    onChange={(e) => handleChange(e, 'password')}
                                                    value={loginDetail.password}
                                                />
                                                <img
                                                    src={passwordVisible ? eyeOpen : eyeClose} // Replace with the path to your eye icon image
                                                    alt="Edit"
                                                    style={{ width: '20px', cursor: 'pointer' }}
                                                    onClick={togglePasswordVisibility}
                                                    className="input-image"
                                                />
                                            </div>
                                            <p
                                                className="mt-2"
                                                onClick={toggleModal}
                                                onMouseOver={(e) => {
                                                    e.target.style.color = 'blue'; // Change color to blue on hover
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.color = 'black'; // Restore default color on mouse out
                                                }}
                                                style={{ cursor: 'pointer', fontWeight: '500', fontSize: '13px', marginLeft: '240px', textDecoration: 'underline', color: 'black' }}
                                            >Forgotten Password!
                                            </p>
                                        </div>
                                    </FormGroup>
                                    <Container className="text-center mt-4">
                                        {/* <Button color="dark">Login</Button> */}
                                        <Button style={{ background: 'rgb(161 122 229)', width: '150px', fontWeight: '500' }}>Login</Button>
                                        {/* <Button color="secondary" onClick={handleReset} type="reset" className="ms-2">Reset</Button> */}
                                        <div className="divider text-center" style={{ marginLeft: '130px' }}>
                                            <span className="divider-line" ></span>
                                            <span className="divider-text">OR</span>
                                            <span className="divider-line"></span>
                                        </div>
                                    </Container>
                                    <div className="text-center" style={{ marginTop: '-10px' }}>
                                        <p style={{ fontWeight: '490' }}>New to our platform? <span onClick={goToSignUp} style={{ cursor: 'pointer', fontWeight: '500' }}>Create an account</span></p>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '400px', height: '40px' }}>
                    <ModalHeader toggle={toggleModal} style={{ background: 'rgb(181 155 227)' }}>
                        <div className='text-center' style={{ position: 'relative', left: '90px', color: 'white' }}>
                            Forgotten Password!!
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {/*Name Field*/}
                        <Form onSubmit={submitForgotten}>
                            <FormGroup className="col-md-6" style={{ marginLeft: '20px' }}>
                                <Label for="username" style={{ fontWeight: '500' }}>Enter Username</Label>
                                <Input
                                    type="text"
                                    placeholder="username"
                                    id="username"
                                    onChange={(e) => handleChangeForgotten(e, 'username')}
                                    value={data.username}
                                    style={{ width: '300px' }}
                                    invalid={error.errors?.response?.data?.username ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.username}</FormFeedback>
                            </FormGroup>
                            <Container className="text-center mt-4">
                                <Button style={{ color: 'white', background: '#8f63bb', marginTop: '5px' }}>Send OTP</Button>
                            </Container>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={isOpenVerify} toggle={toggleModalVerify} style={{ maxWidth: '400px', height: '40px' }}>
                    <ModalHeader toggle={toggleModalVerify} style={{ background: 'rgb(181 155 227)' }}>
                        <div className='text-center' style={{ position: 'relative', left: '90px', color: 'white' }}>
                            Forgotten Password!!
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {/*Name Field*/}
                        <Form>
                            <FormGroup className="col-md-6" style={{ marginLeft: '20px' }}>
                                <Label for="otp" style={{ fontWeight: '500' }}>Enter OTP</Label>
                                <Input
                                    type="text"
                                    placeholder="OTP"
                                    id="otp"
                                    onChange={(e) => handleChangeForgotten(e, 'otp')}
                                    value={data.otp}
                                    style={{ width: '300px' }}
                                    invalid={error.errors?.response?.data?.otp ? true : false}
                                />
                                <FormFeedback>{error.errors?.response?.data?.otp}</FormFeedback>
                            </FormGroup>
                            <p
                                className="mt-0"
                                onClick={resendOTP}
                                onMouseOver={(e) => {
                                    e.target.style.color = 'blue'; // Change color to blue on hover
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.color = 'black'; // Restore default color on mouse out
                                }}
                                style={{ cursor: 'pointer', fontWeight: '500', fontSize: '13px', marginLeft: '20px', textDecoration: 'underline', color: 'black' }}
                            >Resend OTP
                            </p>
                            <Container className="text-center">
                                <Button onClick={submitverify} style={{ color: 'white', background: '#8f63bb', marginTop: '-5px' }}>Verify</Button>
                                {/* <Button onClick={resendOTP} color="dark" style={{ marginLeft: '10px', marginTop:'5px' }}>Resend OTP</Button> */}
                            </Container>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={isOpenPass} toggle={toggleModalPass} style={{ maxWidth: '430px', height: '40px' }}>
                    <ModalHeader toggle={toggleModalPass} style={{ background: 'rgb(181 155 227)' }}>
                        <div className='text-center' style={{ position: 'relative', left: '110px', color: 'white' }}>
                            Change Password!!
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {/*Name Field*/}
                        <Form onSubmit={submitPassChange}>
                            <FormGroup className="col-md-6" style={{ marginLeft: '20px' }}>
                                <Label for="newPassword" style={{ fontWeight: '500' }}>New Password</Label>
                                <Input
                                    type="text"
                                    placeholder="Password"
                                    id="password"
                                    onChange={(e) => handleChangeForgotten(e, 'password')}
                                    value={data.password}
                                    invalid={error.errors?.response?.data?.password ? true : false}
                                    style={{ width: '350px' }}
                                />
                                <FormFeedback>{error.errors?.response?.data?.password}</FormFeedback>
                            </FormGroup>
                            <FormGroup className="col-md-6" style={{ marginLeft: '20px' }}>
                                <Label for="confermPassword" style={{ fontWeight: '500' }}>Confirm Password</Label>
                                <Input
                                    type="text"
                                    placeholder="Conferm Password"
                                    id="CPassword"
                                    onChange={(e) => handleChangeForgotten(e, 'ConfPassword')}
                                    value={data.ConfPassword}
                                    invalid={error.errors?.response?.data?.ConfPassword ? true : false}
                                    style={{ width: '350px' }}
                                />
                                <FormFeedback>{error.errors?.response?.data?.ConfPassword}</FormFeedback>
                            </FormGroup>
                            <Container className="text-center mt-4">
                                <Button style={{ color: 'white', background: '#8f63bb' }}>Submit</Button>
                            </Container>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </BaseSection>

    );
}

export default Login;