import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import BaseSection from "../Components/Base";
import { useState } from "react";
import { singUp } from "../Services/users-service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import backgroundImage from './home-background.jpg';
import text_area from '../Components/text-area-logo.png'
import email_area from '../Components/email_texr.jpg';
import eyeOpen from './eyeOpen.png';
import eyeClose from './eyeClose.png'
import './Login.css'

const SignUp = () => {

    //setData name is writen in camel case i.e if user is writen then we write setUser
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        about: ''
    });

    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [error, setError] = useState({
        errors: {},
        isError: false
    })

    //handle change
    const handleChange = (event, field) => {
        //dynamic setting value
        setData({ ...data, [field]: event.target.value })
    }

    //reseting the form
    const resetData = () => {
        setData({
            name: '',
            email: '',
            password: '',
            about: ''
        })
    };

    //submitting the form
    const submitForm = (event) => {
        event.preventDefault();

        // if (error.isError) {
        //     toast.error("Form data is invalid, correct all details")
        //     setError({...error,isError:false})
        //     return
        // }

        console.log(data)
        //data validation

        //server call
        singUp(data).then((resp) => {
            toast.success("User is register successfully")
            setData({
                name: '',
                email: '',
                password: '',
                about: ''
            })
        })
            .catch((error) => {
                console.log(error.response.status);
                if (error.response.status === 400) toast.error("Form data is invalid, correct all details")
                else if (error.response.status === 500) toast.error("User with the given email is already present")
                //handle error in proper way
                setError({
                    errors: error,
                    isError: true
                })
            })
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    function goToSignUp(){
        navigate("/")
    }

    return (
        <BaseSection>
            <Container
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: '100% 100%', // Stretch the background image to cover the whole Container
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh', // Stretch the Container to cover the whole page vertically
                    maxWidth: '100vw', // Stretch the Container to cover the whole page horizontally
                    margin: 0, // Remove default margin
                    padding: 0, // Remove default padding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Row className="mt-3">
                    <Col sm={2}>
                        <Card
                            color="dark"
                            outline
                            // blur-background
                            className="mt-2 blur-background"
                            style={{
                                width: "450px",
                                position: "absolute", // Set the position to absolute
                                transform: "translate(-50%, -50%)", // Center the card using transform
                                top: "53%", // Center the card vertically
                                left: "50%", // Center the card horizontally
                                // backgroundColor: "rgba(255, 255, 255, 0.7)", // Set the background color with transparency for blur effect
                                marginLeft: '250px'
                            }}
                        >
                            <CardHeader className="text-center">
                                <h4 style={{fontWeight:'500'}}>Sign Up</h4>
                            </CardHeader>
                            <CardBody>
                                {/*Name Field*/}
                                <Form onSubmit={submitForm}>
                                    <FormGroup>
                                        <Label for="name" style={{ fontWeight: '500' }}>Enter Name</Label>
                                        <div className='form-control-wrap'>
                                            <div className="input-with-image">
                                                <Input
                                                    type="text"
                                                    placeholder="Name"
                                                    id="name"
                                                    onChange={(e) => handleChange(e, 'name')}
                                                    value={data.name}
                                                    invalid={error.errors?.response?.data?.name ? true : false}
                                                />
                                                <img src={text_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                                            </div>
                                        </div>
                                        <FormFeedback>
                                            {error.errors?.response?.data?.name}
                                        </FormFeedback>
                                    </FormGroup>
                                    {/*email Field*/}
                                    <FormGroup>
                                        <Label for="email" style={{ fontWeight: '500' }}>Enter Email</Label>
                                        <div className='form-control-wrap'>
                                            <div className="input-with-image">
                                                <Input
                                                    type="email"
                                                    placeholder="Email"
                                                    id="email"
                                                    onChange={(e) => handleChange(e, 'email')}
                                                    value={data.email}
                                                    invalid={error.errors?.response?.data?.email ? true : false}
                                                />
                                                <img src={email_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                                            </div>
                                        </div>
                                        <FormFeedback>{error.errors?.response?.data?.email}</FormFeedback>
                                    </FormGroup>
                                    {/*password Field*/}
                                    <FormGroup>
                                        <Label for="password" style={{ fontWeight: '500' }}>Enter Pasword</Label>
                                        <div className='form-control-wrap'>
                                            <div className="input-with-image">
                                                <Input
                                                    type={passwordVisible ? "text" : "password"}
                                                    placeholder="Password"
                                                    id="password"
                                                    onChange={(e) => handleChange(e, 'password')}
                                                    value={data.password}
                                                    invalid={error.errors?.response?.data?.password ? true : false}
                                                />
                                                <img
                                                    src={passwordVisible?eyeOpen:eyeClose} // Replace with the path to your eye icon image
                                                    alt="Edit"
                                                    style={{ width: '20px', cursor: 'pointer' }}
                                                    onClick={togglePasswordVisibility}
                                                    className="input-image"
                                                />
                                            </div>
                                        </div>
                                        <FormFeedback>
                                            {error.errors?.response?.data?.password}
                                        </FormFeedback>

                                    </FormGroup>
                                    <Container className="text-center">
                                        <Button className="mt-2" style={{ background: 'rgb(161 122 229)', width: '190px', fontWeight:'500' }}>Register</Button>
                                        {/* <Button onClick={resetData} color="secondary" type="reset" className="ms-2">Reset</Button> */}
                                        <div className="divider text-center" style={{marginLeft:'160px'}}>
                                            <span className="divider-line" ></span>
                                            <span className="divider-text">OR</span>
                                            <span className="divider-line"></span>
                                        </div>
                                    </Container>
                                    <div className="text-center" style={{marginTop:'-10px'}}>
                                    <p style={{fontWeight:'490'}}>Already have an account? <span onClick={goToSignUp} style={{cursor:'pointer', fontWeight:'500'}}>Sign in Instead</span></p>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </BaseSection>
    );
}

export default SignUp;