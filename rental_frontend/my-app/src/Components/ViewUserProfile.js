import React, { useEffect, useState, useRef } from 'react'
import { Card, CardBody, CardFooter, Toast } from 'reactstrap';
import { Button, Container, Table, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import editLogo from './edit.jpg';
import plus from './plus.jpg'
import './common.css'
import { useNavigate } from "react-router-dom";
import arrow from '../Pages/PrivatePages/arrow.png'
import tick from './tick.png'
import avatar from './Useravatar.png'
import text_area from './text-area-logo.png'
import email_area from './email_texr.jpg';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { doLogout } from '../AuthServices/Auth';

function ViewUserProfile({ user }) {

  const [data, setData] = useState({
    FName: user.name.split(" ")[0],
    LName: user.name.split(" ")[1],
    Email: user.email
  });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [error, setError] = useState({
    errors: {},
    isError: false
  })

  //handle  add form change
  const handleChange = (event, field) => {

    if (field === 'FName' || field == 'LName') {
      if (!/^[a-zA-Z\s]*$/.test(event.target.value)) {
        setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Only alphabets allowed' } } }, isError: true });
      } else {
        setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
      }
    }
    if (field === 'Email') {
      if (!/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@gmail\.com$/.test(event.target.value)) {
        setError({ ...error, errors: { ...error.errors, response: { data: { [field]: 'Invalid email address' } } }, isError: true });
      } else {
        setError({ ...error, errors: { ...error.errors, response: { data: { [field]: null } } }, isError: false });
      }
    }
    setData({ ...data, [field]: event.target.value })
  }

  function GoBack() {
    navigate("/user/home")
  }

  function submitForm(event) {
    event.preventDefault();
    toast.success("Information updated!!")
  }

  const logout = () => {
    doLogout(() => {
    });
    navigate("/")
  }

  return (
    <Container className="mt-2" style={{ maxWidth: "1400px" }}>
      <Row>
        <Col>
          <h2 className='mt-4' style={{ marginLeft: '153px' }}>User Profile</h2>
          <p style={{ marginLeft: '153px', fontWeight: '500', color: 'gray' }}>Manage user profile details</p>
        </Col>
        <Col xs={4}></Col>
        <Col className='mt-5'>
          <Button
            color="#d8ccccf8"
            style={{ width: '100px', height: '35px', background: isButtonHovered ? "lightblue" : "white", marginLeft: '185px' }}
            className={`custom-button mt-2 ${isButtonHovered ? 'button-hover' : 'shadow'}`}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={GoBack}
          >
            <img src={arrow} height="5" width={17} className='img-fluid mb-1' />
            &nbsp;&nbsp;Back
          </Button>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Card
          className='shadow'
          style={{ height: '425px', width: '1050px', marginLeft: '163px', background: "white", }}
        >
          <div className="avatar-container">
            <img src={avatar} height="12" width={110} className='img-fluid mb-1' />
          </div>
          <hr className='mt-3' style={{ margin: 0 }} /> {/* Divider */}
          <CardBody className='mt-2'>
            <Form onSubmit={submitForm}>
              <div className="row">
                <FormGroup className="col-md-6">
                  <Label for="fname" style={{ fontWeight: '500' }}>First Name</Label>
                  <div className='form-control-wrap'>
                    <div className="input-with-image">
                      <Input
                        type="text"
                        className='form-control ng-untouched ng-pristine ng-valid'
                        placeholder="Enter your First Name"
                        id="fname"
                        onChange={(e) => handleChange(e, 'FName')}
                        value={data.FName}
                        invalid={error.errors?.response?.data?.FName ? true : false}
                      />
                      <img src={text_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                    </div>
                  </div>
                  <FormFeedback>{error.errors?.response?.data?.FName}</FormFeedback>
                </FormGroup>
                <FormGroup className="col-md-6">
                  <Label for="lname" style={{ fontWeight: '500' }}>Last Name</Label>
                  <div className='form-control-wrap'>
                    <div className="input-with-image">
                      <Input
                        type="text"
                        placeholder="Enter your Last Name"
                        id="lname"
                        onChange={(e) => handleChange(e, 'LName')}
                        value={data.LName}
                        invalid={error.errors?.response?.data?.LName ? true : false}
                      />
                      <img src={text_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                    </div>
                  </div>
                  <FormFeedback>{error.errors?.response?.data?.LName}</FormFeedback>
                </FormGroup>
              </div>
              <div className="row">
                <FormGroup className="col-md-6">
                  <Label for="email" style={{ fontWeight: '500' }}>Email</Label>
                  <div className='form-control-wrap'>
                    <div className="input-with-image">
                      <Input
                        type="email"
                        placeholder="Enter your Email"
                        id="email"
                        onChange={(e) => handleChange(e, 'Email')}
                        value={data.Email}
                        invalid={error.errors?.response?.data?.Email ? true : false}
                      />
                      <img src={email_area} alt="Edit" style={{ width: '20px' }} className="input-image" />
                    </div>
                  </div>
                  <FormFeedback>{error.errors?.response?.data?.Email}</FormFeedback>
                </FormGroup>
              </div>
              <hr className='mt-3' style={{ margin: 0 }} /> {/* Divider */}
              <Container>
                <Button className='mt-4' style={{ background: 'rgb(130, 103, 177)', width: '100px', marginLeft: '-10px' }}> <img src={tick} height="5" width={17} className='img-fluid mb-1' />
                  &nbsp;&nbsp;Save</Button>
                <p className='mt-3 note-text' style={{ marginLeft: '-10px' }}>Note: After modifying your profile, sign out and sign in so that you can see the changes.</p>
              </Container>
            </Form>
          </CardBody>
        </Card>
      </Row >
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
              <p>Your Session is expired!! Relogin again</p>
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

export default ViewUserProfile



