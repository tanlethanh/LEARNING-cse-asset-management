import React, { useContext, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import '../../styles/headerfooter.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import Axios from 'axios';

export function Header({
    openCart,
    setOpenCart
}) {
    const navigate = useNavigate();
    const [openUserDetail, setOpenUserDetail] = useState(false)
    const [navBarHidden, setNavBarHidden] = useState(false)
    const { mainUser } = useContext(AppContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const type = searchParams.get("type")
    let location = useLocation()

    const logout = () => {
        Axios.post("/api/auth/logout")
            .then((res) => {
                mainUser.setUser({})
                mainUser.setOrders([])
                navigate("../")
            })
            .catch((err) => {

            })
    }

    return (
        <header id="header" >
            <ul>
                <li className="header-left" onClick={()=> {navigate("/")}}>
                    <div className='header-logo'>
                        <img src="/small_logo.png" alt="image" />
                    </div>
                    <em className="text-logo-1">Asset</em>
                    <em className="text-logo-2">cse</em>
                </li>
                <li className="header-center">
                    <div className="nav-btn" onClick={() => {
                        navigate("/")
                    }}>Home</div>

                    {mainUser.infor.email ?
                        <div className="nav-btn" onClick={() => {
                            navigate("mylist")
                        }}>My orders</div>
                        :
                        <div className="nav-btn" onClick={() => {
                            navigate("login")
                        }}>Log in</div>
                    }

                    {!mainUser.infor.email &&
                        <div className="nav-btn" onClick={() => {
                            navigate("signup")
                        }}>Sign up</div>
                    }

                    {(mainUser.infor.isAdmin) && <div className="nav-btn" onClick={() => {
                        navigate("dashboard")
                    }}>Dash board</div>}
                </li>
                <li className="header-right">
                    {mainUser.infor.email &&
                        <a
                            className="checklist-header-nav nav-user-btn"
                            onMouseEnter={
                                (e) => {
                                    setOpenUserDetail(true)
                                }
                            }
                            onMouseLeave={
                                (e) => {
                                    setOpenUserDetail(false)
                                }
                            }
                        >
                            <p>{mainUser.infor.fullName}</p>
                            <i className="fa-solid fa-circle-user"></i>

                        </a>}
                    <a
                        className="checklist-header-nav nav-btn"
                        onClick={
                            (e) => {
                                setOpenCart(!openCart)
                            }
                        }>
                        <i className="fa-solid fa-box-open"></i>
                    </a>
                </li>
                <li className="hamburger_nav">
                    <i className="fa-solid fa-bars hamburger-icon" onClick={() => {setNavBarHidden(!navBarHidden)}}></i>
                    <a
                        className="checklist-header-nav hamburger-cart"
                        onClick={
                            (e) => {
                                setOpenCart(!openCart)
                                setNavBarHidden(false)
                            }
                        }>
                        <i className="fa-solid fa-box-open"></i>
                    </a>
                </li>
            </ul>

            {openUserDetail &&
                <div
                    className="infor_user_container"
                    onMouseEnter={
                        (e) => {
                            setOpenUserDetail(true)
                        }
                    }
                    onMouseLeave={
                        (e) => {
                            setOpenUserDetail(false)
                        }
                    }
                >
                    <h2>{mainUser.infor.isAdmin ? "ADMIN" : "MEMBER"}</h2>
                    <br/>
                    <div>
                        <i className="fa-solid fa-circle-user"></i>
                        <p>{mainUser.infor.fullName}</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-envelope"></i>
                        <p>{mainUser.infor.email}</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-id-card"></i>
                        <p>{mainUser.infor.studentCode}</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-phone"></i>
                        <p>{mainUser.infor.phoneNumber}</p>
                    </div>
                    <button
                        className='log_out'
                        onClick={()=>{
                            setOpenUserDetail(false)
                            logout()
                        }}
                    >
                        Log out
                    </button>
                </div>}
            
            {navBarHidden &&
                <div className='hamburger-background'>
                    <div className="hamburger-container">
                        <div className="hamburger-route">
                            <button className="hamburger-route-button" onClick={() => {
                                navigate("/");
                                setNavBarHidden(false)
                            }}>Home</button>

                            {mainUser.infor.email ?
                                <button className="hamburger-route-button" onClick={() => {
                                    navigate("mylist");
                                    setNavBarHidden(false)
                                }}>My orders</button>
                                :
                                <button className="hamburger-route-button" onClick={() => {
                                    navigate("login");
                                    setNavBarHidden(false)
                                }}>Log in</button>
                            }

                            {!mainUser.infor.email &&
                                <button className="hamburger-route-button" onClick={() => {
                                    navigate("signup");
                                    setNavBarHidden(false)
                                }}>Sign up</button>
                            }

                            {(mainUser.infor.isAdmin) && <button className="hamburger-route-button" onClick={() => {
                                navigate("dashboard");
                                setNavBarHidden(false)
                            }}>Dash board</button>}
                        </div>
                        {mainUser.infor.email &&<div className="hamburger-user-detail">
                            <div>
                                <i className="fa-solid fa-circle-user"></i>
                                <p>{mainUser.infor.fullName}</p>
                            </div>
                            <div>
                                <i className="fa-solid fa-envelope"></i>
                                <p>{mainUser.infor.email}</p>
                            </div>
                            <div>
                                <i className="fa-solid fa-id-card"></i>
                                <p>{mainUser.infor.studentCode}</p>
                            </div>
                            <div>
                                <i className="fa-solid fa-phone"></i>
                                <p>{mainUser.infor.phoneNumber}</p>
                            </div>
                        </div>}


                        {(mainUser.infor.email && location.pathname=="/dashboard") &&
                        <div className="hamburger-user-detail">
                            <h2 className="menu_title" >DASH BOARD</h2>

                            <h3 className='menu_list_title'>Items, devices</h3>
                            <button
                                className={"hamburger_list_admin " + ((tab === "items" || !tab) && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "items"
                                })}
                            >
                                Items
                            </button>

                            <h3 className='menu_list_title'>Users</h3>
                            <button
                                className={"hamburger_list_admin " + (tab === "users" && type === "register" && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "users",
                                    type: "register"
                                })}
                            >
                                Register users
                            </button>

                            <button
                                className={"hamburger_list_admin " + (tab === "users" && type === "member" && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "users",
                                    type: "member"
                                })}
                            >
                                Member
                            </button>

                            <h3 className='menu_list_title'>Oders</h3>
                            <button
                                className={"hamburger_list_admin " + (tab === "orders" && type === "pending" && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "orders",
                                    type: "pending"
                                })}
                            >
                                Pending orders
                            </button>

                            <button
                                className={"hamburger_list_admin " + (tab === "orders" && type === "accepted" && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "orders",
                                    type: "accepted"
                                })}
                            >
                                Processing orders
                            </button>

                            <button
                                className={"hamburger_list_admin " + (tab === "orders" && type === "complete" && "chosen")}
                                onClick={() => setSearchParams({
                                    tab: "orders",
                                    type: "complete"
                                })}
                            >
                                Complete orders
                            </button>

                        </div>}

                        {(mainUser.infor.email && (location.pathname=="/mylist" || location.pathname.indexOf("/user")==0)) &&
                        <div className="hamburger-user-detail">
                            <h2 className="menu_title" >MY ORDER LIST</h2>
                            <button
                                className={(tab === "current" || !tab) ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ tab: "current" }) }}
                            >
                                Current list
                            </button>
                            <button
                                className={tab === "borrowing" ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ tab: "borrowing" }) }}
                            >
                                Borrowing list
                            </button>
                            <button
                                className={tab === "returned" ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ tab: "returned" }) }}
                            >
                                Returned list
                            </button>
                        </div>}

                        {(mainUser.infor.email && location.pathname.indexOf("/item")==0) &&
                        <div className="hamburger-user-detail">
                            <h2 className="menu_title" >LIST</h2>
                            <button
                                className={(tab === "current" || !tab) ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ type: "current" }) }}
                            >
                                Current borrower
                            </button>
                            <button
                                className={(tab === "done") ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ type: "done" }) }}
                            >
                                Old borrower
                            </button>
                            <button
                                className={(tab === "all") ? "hamburger_list_admin chosen" : "hamburger_list_admin"}
                                onClick={() => { setSearchParams({ type: "all" }) }}
                            >
                                All of borrower
                            </button>
                        </div>}

                        {mainUser.infor.email && <button
                            className='hamburger_log_out'
                            onClick={()=>{
                                setOpenUserDetail(false)
                                setNavBarHidden(false)
                                logout()
                            }}
                        >
                            Log out
                        </button>}
                    </div>
                </div>}

        </header>
    )
}

export function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="footer">
            <div className="top_footer">
                <div className="info">
                    <h3 className="footer-title">Information</h3>
                    <p>...</p>
                </div>
                <div className="navi">
                    <h3 className="footer-title">Navigation</h3>
                    <div className="item item_btn" onClick={() => {
                        navigate("../")
                    }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <p>Home page</p>
                    </div>
                    <div className="item item_btn" onClick={() => {
                        navigate("../dashboard")
                    }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <p>Dash board </p>
                    </div>
                </div>
                <div className="contact">
                    <h3 className="footer-title">Contact</h3>
                    <a className="item">
                        <i className="fa-solid fa-location-dot"></i>
                        <p>602 H6</p>
                    </a>
                    <a className="item">
                        <i className="fa-solid fa-envelope"></i>
                        <p>admin@hcmut.edu.vn</p>
                    </a>
                </div>
            </div>
            <div className="bot_footer">
                <div className="social">
                    <i className="fa-brands fa-facebook-square"></i>
                    <i className="fa-brands fa-twitter-square"></i>
                    <i className="fa-brands fa-instagram-square"></i>
                    <i className="fa-brands fa-linkedin"></i>
                </div>
                <div className="another">
                    <h4 className="left">Allright Reserved ...</h4>
                    <div className="right">
                        <h4>Disclaimer</h4>
                        <h4>Privacy Policy</h4>
                        <h4>Term Of Use</h4>
                    </div>
                </div>
            </div>
        </footer>
    )
}

