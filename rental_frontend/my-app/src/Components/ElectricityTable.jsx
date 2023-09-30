import React, { useState } from 'react'
import { Button, Container, Table } from 'reactstrap';
import editLogo from './edit.jpg'
import { getAllUnpaidElectric, updateElectric } from '../Services/ElectricityService';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function ElectricityTable() {

    const [elctricDetail, setElctricDetail] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    let fetch = async () => {
        const result = await getAllUnpaidElectric();
        if (result) setElctricDetail([...result.Data]);
    }
    if (elctricDetail.length == 0) fetch();

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
        Month_Left: ''
    });

    const toggleModal = () => {
        resetData();
        setIsOpen(!isOpen);
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
            Month_Left: ''
        })
    };

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
        toggleModal();
        //server call
        await updateElectric(data);
        toast.success("Electricity Detail Updated!")
        resetData();
        if(elctricDetail.length == 1)setElctricDetail([]);
        fetch();
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
            Month_Left: electric.Month_Left
        });
        setIsOpen(!isOpen);
    };

    const completeSubmit = async (event) => {
        event.preventDefault();

        if (error.isError) {
            toast.error("Form data is invalid, correct all details")
            setError({ ...error, isError: false })
            return
        }
        toggleModal();
        //server call
        await updateElectric(data,'Complete');
        toast.success("Electricity Bill Completed!")
        resetData();
        if(elctricDetail.length == 1)setElctricDetail([]);
        fetch();
    }


    return (
        <>
            {
                elctricDetail.length == 0 && (
                    <p className='text-center mt-2'> No Unpaid Electricity</p>
                )
            }
            {
                elctricDetail.length > 0 && (
                    <>
                        <Table
                            bordered
                            hover
                            responsive
                            size=""
                            striped
                            className='text-center mt-3'
                            style={{ backgroundColor: "purple", color: "white" }}
                        >
                            <thead >
                                <tr>
                                    <th style={{ background: '#ade6c6' }}>
                                        Shop ID
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Name
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Original Date
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Current Reading
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Past Reading
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Unit Used
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Amount
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Amount Paid
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Amount Left
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Status
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    elctricDetail.map((electric) => (
                                        <tr>
                                            <th scope="row" key={1}>
                                                {electric.RentId}
                                            </th>
                                            <td scope="row" key={2}>
                                                {electric.Name}
                                            </td>
                                            <td scope="row" key={3}>
                                                {electric.Original_Date}
                                            </td>
                                            <td scope="row" key={4}>
                                                {electric.Current_Reading}
                                            </td>
                                            <td scope="row" key={5}>
                                                {electric.Past_Reading}
                                            </td>
                                            <td scope="row" key={6}>
                                                {electric.Unit_Used}
                                            </td>
                                            <td scope="row" key={6}>
                                                {electric.Amount}
                                            </td>
                                            <td scope="row" key={6}>
                                                {electric.Amount_Paid}
                                            </td>
                                            <td scope="row" key={6}>
                                                {electric.Amount_Left}
                                            </td>
                                            <td scope="row" key={6}>
                                                {electric.Status}
                                            </td>
                                            <td scope="row" key={9}>
                                                <img src={editLogo} height="5" width={20} className='img-fluid ms-2' onClick={() => handleEditButtonClick(electric)} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        {/* Add Modal */}
                        <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '800px' }}>
                            <ModalHeader toggle={toggleModal} style={{ background: '#00ffd0' }}>
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
                                        <Button onClick={completeSubmit} className="ms-2 btn btn-secondary" style={{background: 'rgb(85, 221, 85)'}}>Complete</Button>
                                    </Container>
                                </Form>
                            </ModalBody>
                        </Modal>
                    </>
                )
            }
        </>
    )
}
