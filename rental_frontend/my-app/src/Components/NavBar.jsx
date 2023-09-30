import React, { useEffect, useState } from 'react';
import './navBar.css';
import { NavLink as ReactLink, useNavigate } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from 'reactstrap';
import { doLogout, getCurrentUser, isLoggedIn } from '../AuthServices/Auth';
import logo from './logo.jpeg';
import dashboard from './dashboard.png'
import rent from './rent.png'
import electricity from './electric.png'
import tenant from './tenant.png'
import profile from './profile.jpeg';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import logOut from './logout.png'
import profileV from './viewProfile.jpg'
import sign from './signUpLogo.png'

const CustomNavBar = () => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        setLogin(isLoggedIn);
        setUser(getCurrentUser());
    }, [login]);  //if we pass null in place of login then the useeffect fn will run only once but here it will run everytime the login value changes

    const logout = () => {
        doLogout(() => {
            //user is logout so redirect it to login page
            setLogin(false);
            //navigate("/")
        });
        navigate("/")
    }

    const profilePage = ()=>{
        navigate("/user/profile-info")
    }

    const loginPage = ()=>{
        navigate("/");
    }

    return (
        <div >
            <Navbar
                color="rgb(130 103 177)"
                bold
                style={{ background: 'rgb(130 103 177)' }}
                expand="md"
                fixed=""
                className='px-5'
            >
                {
                    !login && (
                        <NavbarBrand tag={ReactLink} to="/">
                            <img src={logo} height="5" width={40} className='img-fluid rounded-circle' />
                        </NavbarBrand>
                    )
                }
                {
                    login && (
                        <NavbarBrand>
                            <img src={logo} height="20" className='img-fluid rounded-circle' />
                        </NavbarBrand>
                    )
                }
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {
                            login && (
                                <>
                                    <NavItem>
                                        {/* <div className="button-box rounded border-0 text-center" style={{ height: '40px', width:'118px'}}> */}
                                            <NavLink tag={ReactLink} to="/user/home" style={{fontSize:'14px'}} className = 'rounded border-0 active-link'>
                                                <img src={dashboard} height="1" width={20} className='img-fluid mb-1' style={{ marginRight: '5px' }} />
                                                DashBoard
                                            </NavLink>
                                        {/* </div> */}
                                    </NavItem>
                                    <NavItem>
                                        {/* <div className="button-box rounded border-0 text-center" style={{width:'111px', height:'40px'}}> */}
                                            <NavLink tag={ReactLink} to="/user/rent" style={{width:'100px',fontSize:'14px', marginLeft:'15px'}} className = 'rounded border-0 text-center active-link'>
                                                <img src={rent} height="1" width={20} className='img-fluid mb-1' style={{ marginRight: '5px' }} />
                                                Rent
                                            </NavLink>
                                        {/* </div> */}
                                    </NavItem>
                                    <NavItem>
                                        {/* <div className="button-box rounded border-0 text-center" style={{width:'112px', height:'40px'}}> */}
                                            <NavLink tag={ReactLink} to="/user/electricity" style={{width:'112px',fontSize:'14px',marginLeft:'15px'}} className = 'rounded border-0 text-center active-link'>
                                                <img src={electricity} height={1} width={20} className='img-fluid mb-1' style={{ marginRight: '5px' }} />
                                                Electricity
                                            </NavLink>
                                        {/* </div> */}
                                    </NavItem>
                                    <NavItem>
                                        {/* <div className="button-box rounded border-0 text-center" style={{ height: '40px', width:'111px'}}> */}
                                            <NavLink tag={ReactLink} to="/user/tenant" style={{height: '40px',width:'111px',fontSize:'14px', marginLeft:'15px'}} className = 'rounded border-0 text-center active-link'>
                                                <img src={tenant} height={2} width={30} className='img-fluid mb-1' style={{ marginRight: '5px' }} />
                                                Tenant
                                            </NavLink>
                                        {/* </div> */}
                                    </NavItem>
                                </>
                            )
                        }
                        {
                            !login && (
                                <>
                                    {/* <NavItem>
                                        <div className="button-box rounded border-0">
                                            <NavLink tag={ReactLink} to="/about">About</NavLink>
                                        </div>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <div className="button-box rounded border-0">
                                            <DropdownToggle nav caret>
                                                More
                                            </DropdownToggle>
                                        </div>
                                        <DropdownMenu right>
                                            {/* <DropdownItem>Services</DropdownItem> */}
                                            {/* <DropdownItem>Contack Us</DropdownItem> */}
                                        {/* </DropdownMenu>
                                    // </UncontrolledDropdown> */} 
                                    <NavItem>
                                        <div>
                                            <h5 onClick={loginPage} style={{color:'white',cursor:'pointer',marginTop:'5px'}}>Rental Shops</h5>
                                        </div>
                                    </NavItem>
                                </>
                            )
                        }
                    </Nav>

                    {/*Login and Logout*/}
                    <Nav navbar>

                        {
                            login && (
                                <>
                                    <NavItem>
                                        <NavLink>
                                            <DropdownButton
                                                id={`dropdown-1`}
                                                title={
                                                    <div className="dropdown-content" style={{ height: '25px' }}>
                                                        <img src={profile} width={30} height={30} className='rounded-5 border-0' />
                                                        <div className="names-container">
                                                            <span className="user-name">{user.name}</span>
                                                        </div>
                                                    </div>
                                                }
                                                variant="transparent custom-dropdown-button"
                                            >
                                                <Dropdown.Item style={{ background: '#d0d4e1', width: '250px', height: '60px', cursor: 'default' }}>
                                                    <div className="dropdown-content">
                                                        <img src={profile} width={35} height={30} className='rounded-5 border-0' />
                                                        <div className="names-container">
                                                            <span className="owner-name1 mt-1">{user.name}</span>
                                                            <span className="user-name1">anujg0028@gmail.com</span>
                                                        </div>
                                                    </div>
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item onClick={()=>profilePage()}>
                                                    <img src={profileV} height="5" width={15} className='img-fluid mb-1' />
                                                    &nbsp;&nbsp;<span style={{ fontWeight: '500' }}>View Profile</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item className='mt-1' onClick={()=>logout()}>
                                                    <img src={logOut} height="5" width={15} className='img-fluid mb-1' />
                                                    &nbsp;&nbsp;<span style={{ fontWeight: '500' }}>Sign Out</span>
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </NavLink>
                                    </NavItem>
                                    {/* <NavItem>
                                        <div className="rounded border-0">
                                            <NavLink>
                                                <b className="user-name">{user.name}</b>
                                            </NavLink>
                                        </div>
                                    </NavItem> */}
                                    {/* <NavItem>
                                        <div className="button-box rounded border-0" style={{ height: '40px' }}>
                                            <NavLink tag={ReactLink} to="/user/profile-info">
                                                Profile
                                            </NavLink>
                                        </div>
                                    </NavItem>
                                    <NavItem>
                                        <div className="button-box rounded border-0" style={{ height: '40px' }}>
                                            <NavLink onClick={logout} tag={ReactLink} to="/">
                                                Logout
                                            </NavLink>
                                        </div>
                                    </NavItem> */}
                                </>
                            )
                        }

                        {
                            !login && (
                                <>
                                    {/* <NavItem>
                                        <div className="button-box rounded border-0">
                                            <NavLink tag={ReactLink} to="/login">
                                                Login
                                            </NavLink>
                                        </div>
                                    </NavItem> */}
                                    <NavItem>
                                        {/* <div className="button-box rounded border-0"> */}
                                            <NavLink tag={ReactLink} to="/signup" style={{width:'112px',fontSize:'14px',marginLeft:'15px'}} className = 'rounded border-0 text-center active-link'>
                                            <img src={sign} height={1} width={15} className='img-fluid mb-1' style={{ marginRight: '5px' }} />
                                            &nbsp;Sign Up
                                            </NavLink>
                                        {/* </div> */}
                                    </NavItem>
                                </>
                            )
                        }
                    </Nav>
                    {/* <NavbarText></NavbarText> */}
                </Collapse>
            </Navbar>
        </div >
    );
}
export default CustomNavBar;