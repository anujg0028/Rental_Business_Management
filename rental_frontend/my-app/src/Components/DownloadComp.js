import { useParams } from 'react-router-dom'
import { getByIdAndMonth } from '../Services/RentServices'
import { getByIdAndMonthE } from '../Services/ElectricityService'

import React, { useEffect, useState } from 'react'
import { Button, Container, Col, Row } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Form } from "reactstrap";
import './common.css'
import arrow from '../Pages/PrivatePages/arrow.png'
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";
import logo from './logo.jpeg'
import owner from './owner_sign.jpeg'
import download from './downButton.jpg'
import { doLogout } from '../AuthServices/Auth';

const monthsMap = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function DownloadComp() {

    const navigate = useNavigate();
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isOpenAuth, setIsOpenAuth] = useState(false);
    const [isButtonHovered1, setIsButtonHovered1] = useState(false);
    const { back, id, month, year } = useParams();
    const [about, setAbout] = useState("");
    const [status, setStatus] = useState("");
    const [amount, setAmount] = useState(0);
    const [dataR, setDataR] = useState({
        Original_Date: '',
        Amount_Left: '',
        Amount_Paid: '',
        Name: '',
        Status: '',
        Paid_Date: '',
        Receipt: '',
        RentId: ''
    });

    const toggleModalAuth = () => {
        setIsOpenAuth(!isOpenAuth);
    };

    function rentStartDate(resultR) {
        let originalDateR = resultR.Data.Original_Date.split("/")
        let monthR = parseInt(originalDateR[1]) - 1;
        let prevMonthR;
        if (monthR > 9) prevMonthR = monthR;
        else prevMonthR = "0" + monthR;
        let startDR = originalDateR[0] + "/" + prevMonthR + "/" + originalDateR[2].substring(2);
        return startDR
    }

    async function electricStartDateP(resultE) {
        let originalDateE = resultE.Data.Original_Date.split("/");
        let monthE = parseInt(originalDateE[1]) - 1;
        let data = await getByIdAndMonthE(resultE.Data.RentId, monthsMap[monthE], originalDateE[2])
        if (data == "Unautho") {
            if (isOpenAuth == false) toggleModalAuth();
        }
        else {
            if (data.Data.Month_Left == 'NA') {
                let prevMonthE;
                if (monthE > 9) prevMonthE = monthE;
                else prevMonthE = "0" + monthE;
                let startDE = originalDateE[0] + "/" + prevMonthE + "/" + originalDateE[2].substring(2);
                return startDE
            }
            else {
                let monthLeft = data.Data.Month_Left.split("-");
                let prevMonth = parseInt(originalDateE[1]) - parseInt(monthLeft[1]) - 1;
                let finalMonth, year;
                if (prevMonth < 0) {
                    finalMonth = 12 + prevMonth;
                    year = parseInt(originalDateE[2].substring(2)) - 1;
                }
                else {
                    if (prevMonth > 9) finalMonth = prevMonth;
                    else finalMonth = "0" + prevMonth;
                    year = originalDateE[2].substring(2);
                }
                let startDE = originalDateE[0] + "/" + finalMonth + "/" + year;
                return startDE;
            }
        }
    }

    async function electricStartDateL(resultE) {
        let originalDateE = resultE.Data.Original_Date.split("/");
        let monthE = parseInt(originalDateE[1]) - 1;
        let data = await getByIdAndMonthE(resultE.Data.RentId, monthsMap[monthE], originalDateE[2])
        if (data == "Unautho") {
            if (isOpenAuth == false) toggleModalAuth();
        }
        else {
            if (data.Data.Month_Left == 'NA') return data.Data.Paid_Date;
            else {
                let monthLeft = data.Data.Month_Left.split("-");
                let prevMonth = parseInt(originalDateE[1]) - parseInt(monthLeft[1]) - 1;
                let finalMonth, year;
                if (prevMonth < 0) {
                    finalMonth = 12 + prevMonth;
                    year = parseInt(originalDateE[2].substring(2)) - 1;
                }
                else {
                    if (prevMonth > 9) finalMonth = prevMonth;
                    else finalMonth = "0" + prevMonth;
                    year = originalDateE[2].substring(2);
                }
                let startDE = originalDateE[0] + "/" + finalMonth + "/" + year;
                return startDE;
            }
        }

    }

    const fetchAll = async () => {
        const resultR = await getByIdAndMonth(id, month, year);
        const resultE = await getByIdAndMonthE(id, month, year);
        if (resultR == "Unautho") {
            if (isOpenAuth == false) toggleModalAuth();
        }
        else {
            if (resultR.Data != null) {
                // if (resultR.Data.Status === 'PAID') setRent(true);
                setDataR({ ...resultR.Data });
            }
            if (resultE.Data != null) {
                // if (resultE.Data.Status === 'PAID' || resultE.Data.Status === 'LEFT') setElectricity(true);
                // setDataE({ ...resultE.Data });
            }
            // if (resultE.Data == null) setElectricityApply(true);
            if (resultR.Data != null && resultE.Data != null) {
                //both
                if (resultE.Data.Status == 'PAID') {
                    let startDR = rentStartDate(resultR);
                    let startDE = await electricStartDateP(resultE);
                    let originalDate = resultR.Data.Original_Date.split("/")
                    let endD = originalDate[0] + '/' + originalDate[1] + '/' + originalDate[2].substring(2);
                    let str = `Paid rent for the month of ${resultR.Data.Month} [From ${startDR} to ${endD}]
Electricity: Paid ${formatNumber(resultE.Data.Amount_Paid)} [From ${startDE} to ${resultE.Data.Original_Date}]
Current Reading: ${resultE.Data.Current_Reading} || Old Reading: ${resultE.Data.Past_Reading}`
                    console.log(str);
                    setAbout(str);
                }
                else if (resultE.Data.Status == 'LEFT') {
                    //LEFT
                    let startDR = rentStartDate(resultR);
                    let startDE = await electricStartDateL(resultE);
                    let originalDate = resultR.Data.Original_Date.split("/")
                    let endD = originalDate[0] + '/' + originalDate[1] + '/' + originalDate[2].substring(2);
                    let str = `Paid rent for the month of ${resultR.Data.Month} [From ${startDR} to ${endD}]
Electricity: Left for ${resultE.Data.Month} month [Old Reading: ${resultE.Data.Past_Reading} [${startDE}]]`
                    console.log(str);
                    setAbout(str);
                }
                else {
                    let startDR = rentStartDate(resultR);
                    let startDE = await electricStartDateL(resultE);
                    let originalDate = resultR.Data.Original_Date.split("/")
                    let endD = originalDate[0] + '/' + originalDate[1] + '/' + originalDate[2].substring(2);
                    let str = `Paid rent for the month of ${resultR.Data.Month} [From ${startDR} to ${endD}]\n
                Electricity: NOT PAID [From ${startDE} to ${resultE.Data.Original_Date}]\n
Current Reading: ${resultE.Data.Current_Reading} || Old Reading: ${resultE.Data.Past_Reading}`;
                    console.log(str);
                    setAbout(str);
                }
            }
            else if (resultR.Data != null && resultE.Data == null) {
                let originalDate = resultR.Data.Original_Date.split("/")
                console.log(originalDate, resultR.Data.Original_Date)
                let month = parseInt(originalDate[1]) - 1;
                let prevMonth;
                if (month > 9) prevMonth = month;
                else prevMonth = "0" + month;
                let startD = originalDate[0] + "/" + prevMonth + "/" + originalDate[2].substring(2);
                let endD = originalDate[0] + '/' + originalDate[1] + '/' + originalDate[2].substring(2);
                let str = `Paid rent for the month of ${resultR.Data.Month} [From ${startD} to ${endD}]`
                setAbout(str);
            }

            if ((resultR.Data != null && resultE.Data != null) && (resultR.Data.Status == 'PAID' && resultE.Data.Status == 'PAID')) {
                setStatus('Paid');
                setAmount(parseInt(resultR.Data.Amount_Paid) + parseInt(resultE.Data.Amount_Paid))
            }
            else if ((resultR.Data != null && resultE.Data != null) && (resultR.Data.Status == 'PAID' && resultE.Data.Status == 'UNPAID')) {
                setStatus('Half Paid');
                setAmount(parseInt(resultR.Data.Amount_Paid))
            }
            else if ((resultR.Data != null && resultE.Data != null) && (resultR.Data.Status == 'UNPAID' && resultE.Data.Status == 'PAID')) {
                setStatus('Half Paid');
                setAmount(parseInt(resultE.Data.Amount_Paid))
            }
            else if ((resultR.Data != null && resultE.Data != null) && (resultR.Data.Status == 'PAID' && resultE.Data.Status == 'LEFT')) {
                setStatus('Paid');
                setAmount(parseInt(resultR.Data.Amount_Paid))
            }
            else if (resultR.Data != null && resultE.Data == null) {
                setStatus('Paid');
                setAmount(parseInt(resultR.Data.Amount_Paid))
            }
        }
    }

    function formatNumber(value) {
        if (value == null) return null
        return value.toLocaleString('en-IN');
    }

    useEffect(() => {
        fetchAll();
    }, [])

    function handleBackButton() {
        navigate(`/user/${back}`);
    }

    const logout = () => {
        doLogout(() => {
        });
        navigate("/")
    }

    function handleDownloadScreenshot() {
        const containerElement = document.querySelector('.screenshot-container'); // Replace with the appropriate selector for your container

        if (containerElement) {
            html2canvas(containerElement).then(canvas => {
                // Convert canvas to image data URL
                const imageDataURL = canvas.toDataURL('image/png'); // 'image/jpeg' for JPEG format

                // Create a download link and trigger the download
                const a = document.createElement('a');
                a.href = imageDataURL;
                a.download = 'screenshot.png'; // 'screenshot.jpg' for JPEG format
                a.click();
            });
        }
    }


    return (
        <Container className="mt-5" style={{ maxWidth: "1500px" }}>
            <Row>
                <Col>
                    <h2 className='mt-0' style={{ marginLeft: '150px' }}>RECEIPT</h2>
                    {/* <p style={{ marginLeft: '150px' }}><b>Total Active Tenant : {user.length} </b></p> */}
                </Col>
                <Col xs={5}></Col>
                <Col className='mt-0'>
                    <Button
                        color='#d8ccccf8'
                        style={{ width: '100px', height: '35px', background: 'white', marginLeft: '50px' }}
                        className={`custom-button mt-0 ${isButtonHovered ? 'button-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        onClick={handleBackButton}
                    >
                        <img src={arrow} height="5" width={15} className='img-fluid mb-1' />
                        &nbsp;Back
                    </Button>
                </Col>
                <Col className='mt-0'>
                    <Button
                        color='#d8ccccf8'
                        style={{ width: '120px', height: '35px', background: 'white', marginLeft: '-80px' }}
                        className={`custom-button mt-0 ${isButtonHovered1 ? 'button-hover' : 'shadow'}`}
                        onMouseEnter={() => setIsButtonHovered1(true)}
                        onMouseLeave={() => setIsButtonHovered1(false)}
                        onClick={handleDownloadScreenshot}
                    >
                        <img src={download} height="5" width={15} className='img-fluid mb-1' />
                        &nbsp;Download
                    </Button>
                </Col>
            </Row>
            <Row className='mt-4 text-center' style={{ height: '570px' }}>
                <Container className='mt-4  borderd-1 rounded-1 screenshot-container' style={{ maxWidth: "570px", height: '450px', background: 'white' }}>
                    <div className="d-flex align-items-center" style={{ marginLeft: '250px' }}>
                        <img src={logo} height="12" width={50} className='img-fluid mt-3 rounded' style={{ marginLeft: '-80px' }} />
                        &nbsp;<h4 className='mt-3'>Rental Shops</h4>
                    </div>
                    <Row className='mt-5'>
                        <Col>
                            <h5 style={{ marginLeft: '38px' }}>Shop Id:</h5>
                        </Col>
                        <Col>
                            <p style={{ marginLeft: '-140px', fontSize: 'larger', fontWeight: '450', marginTop: '-3px' }}>{dataR.RentId}</p>
                        </Col>
                        <Col>
                            <h5 style={{ marginLeft: '20px' }}>Receipt:</h5>
                        </Col>
                        <Col>
                            <p style={{ marginLeft: '-90px', fontSize: 'larger', fontWeight: '450', marginTop: '-2px' }}>{dataR.Receipt}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 style={{ marginLeft: '20px' }}>Name:</h5>
                        </Col>
                        <Col>
                            <p style={{ marginLeft: dataR.Name.length <= 14 ? '-67px' : '-40px', fontSize: 'larger', fontWeight: '450', marginTop: '-2px' }}>{dataR.Name}</p>
                        </Col>
                        <Col>
                            <h5 style={{ marginLeft: '-5px' }}>Date:</h5>
                        </Col>
                        <Col>
                            <p style={{ marginLeft: '-130px', fontSize: 'larger', fontWeight: '450', marginTop: '-2px' }}>{dataR.Paid_Date}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 style={{ marginLeft: '40px' }}>Amount:</h5>
                        </Col>
                        <Col>
                            <p style={{ marginLeft: '-107px', fontSize: 'larger', fontWeight: '450', marginTop: '-2px' }}>{formatNumber(amount)}</p>
                        </Col>
                        <Col>
                            <h5 style={{ marginLeft: '7px' }}>Status:</h5>
                        </Col>
                        <Col>
                            <p style={{ color: status == 'Half Paid' ? 'red' : '', marginLeft: status == 'Half Paid' ? '-130px' : '-162px', fontSize: 'larger', fontWeight: '450', marginTop: '-2px' }}>{status}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 style={{ marginLeft: '-399px' }}>Details:</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {/* <Container className="my-container mt-2" style={{ marginLeft: '40px', border: '1px solid black', height:about.split('\n').length == 1?'50px':'80px', width: '490px' }}>
                                {about.split('\n').map((line, index) => (
                                    <p key={index} style={{ fontWeight: '500' ,margin: '2px 0', padding: '5', textAlign: 'left', whiteSpace: 'pre', marginLeft:index == 2?'-71px':'' }}>{line}</p>
                                ))}
                            </Container> */}
                            <Container className="my-container mt-2" style={{ marginLeft: '40px', border: '1px solid black', height: about.split('\n').length == 1 ? '50px' : '80px', width: '460px' }}>
                                {about.split('\n').map((line, index) => (
                                    <p key={index} style={{ fontSize: '15px', fontWeight: '500', margin: '2px 0', padding: '5', textAlign: 'left', whiteSpace: 'pre', marginLeft: index == 2 && (about.split('\n')[1]).includes("Paid") ? '-1px' : index == 2 ? '-66px' : '' }} className={line.includes("NOT PAID") && index === 2 ? "red-text" : ""}>
                                        {line}
                                    </p>
                                ))}
                            </Container>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col>
                            <div className="d-flex align-items-center" style={{ marginLeft: '38px' }}>
                                <h4 className='mt-3'>Owner:</h4>&nbsp;
                                <img src={owner} height="12" width={90} className='img-fluid mt-3' style={{ marginLeft: '10px' }} />
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex align-items-center" style={{ marginLeft: '35px' }}>
                                <h4 className='mt-3'>Tenant:</h4>&nbsp;
                                <img src={owner} height="12" width={90} className='img-fluid mt-3' style={{ marginLeft: '10px' }} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Row>
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
        </Container >

    )
}

export default DownloadComp