import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Tab.css';
import { Row, Col, Button, Input } from 'reactstrap';
import back from '../Pages/PrivatePages/arrow.png'
import { useNavigate } from 'react-router-dom';

const TabD = ({ children }) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    function handleBackButton(){
         navigate("/user/home");
    }

    return (
        <div>
            <div>
                <Row style={{ maxWidth: '1250px', height: '45px', background: 'rgb(190 170 225)', marginLeft: '46px' }} className='rounded-3'>
                    {React.Children.map(children, (child, index) => (
                        <div
                            className={`tab ${activeTab === index ? 'active' : 'inactive'} border-1 rounded-3 text-center mt-2`}
                            onClick={() => handleTabClick(index)}
                            style={{ width: '90px', height: '30px', marginLeft: '7px' }}
                        >
                            <p style={{ marginTop: '-6px' }}>{child.props.label}</p>
                        </div>
                    ))}
                    <Col xs={7}></Col>
                    <Col xs='auto' className='d-flex justify-content-end'>
                        <Button
                            color='#d8ccccf8'
                            style={{ width: '130px', height: '35px', background: 'white' }}
                            className={`custom-button mt-1 mb-1 ${isButtonHovered ? 'button-hover' : ''}`}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                            onClick={handleBackButton}>
                            <img src={back} height="5" width={15} className='img-fluid mb-1' />
                            &nbsp;Back
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="tab-content">
                {React.Children.toArray(children)[activeTab]}
            </div>
        </div>
    );
};

export default TabD;
