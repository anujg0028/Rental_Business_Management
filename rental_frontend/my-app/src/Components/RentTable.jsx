import React, { useEffect, useState } from 'react'
import { Button, Container, Table } from 'reactstrap';
import editLogo from './edit.jpg'
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import './common.css'
import { getAllUnpaid, updateRent } from '../Services/RentServices';

function RentTable() {

    const [isOpen, setIsOpen] = useState(false);
    const [rentDetail, setRentDetail] = useState([]);
    let fetch = async () => {
        const result = await getAllUnpaid();
        if (result) setRentDetail([...result.Data]);
    }
    if (rentDetail.length == 0) fetch();
    const [data, setData] = useState({
        Original_Date: '',
        Amount_Left: '',
        Amount_Paid: '',
        Name: '',
        Status: '',
        RentId: '',
        Paid_Date: '',
        Month: ''
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
            Month: ''
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
        if (!/^\d*$/.test(data.Amount_Paid)) {
            toast.error("Amount Should be Valid!!");
            return;
        }
        toggleModal();
        //server call
        await updateRent(data);
        toast.success("Rent Updated!")
        resetData();
        if (rentDetail.length == 1) setRentDetail([])
        fetch();
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
            Month: rent.Month
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
        await updateRent(data, 'Complete');
        toast.success("Rent Completed!")
        resetData();
        if (rentDetail.length == 1) setRentDetail([])
        fetch();
    }


    return (
        <>
            {
                rentDetail.length == 0 && (
                    <p className='text-center mt-2'> No Unpaid Rent</p>
                )
            }
            {
                rentDetail.length > 0 && (
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
                                        Amount Left
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Amount Paid
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Original Date
                                    </th>
                                    <th style={{ background: '#ade6c6' }}>
                                        Month
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
                                    rentDetail.map((rent) => (
                                        <tr>
                                            <th scope="row" key={1}>
                                                {rent.RentId}
                                            </th>
                                            <td scope="row" key={2}>
                                                {rent.Name}
                                            </td>
                                            <td scope="row" key={3}>
                                                {rent.Amount_Left}
                                            </td>
                                            <td scope="row" key={4}>
                                                {rent.Amount_Paid}
                                            </td>
                                            <td scope="row" key={5}>
                                                {rent.Original_Date}
                                            </td>
                                            <td scope="row" key={6}>
                                                {rent.Month}
                                            </td>
                                            <td scope="row" key={6}>
                                                {rent.Status}
                                            </td>
                                            <td scope="row" key={9}>
                                                <img src={editLogo} height="5" width={20} className='img-fluid ms-2' onClick={() => handleEditButtonClick(rent)} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        {/* Add Modal */}
                        <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '800px' }}>
                            <ModalHeader toggle={toggleModal} style={{ background: '#00ffd0' }}>
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

export default RentTable