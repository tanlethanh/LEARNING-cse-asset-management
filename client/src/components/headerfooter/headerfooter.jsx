import React, { useState } from 'react';
import '../../styles/headerfooter.css'
import { useNavigate } from 'react-router-dom';
import Cart from './cart';

export function Header({ openCart, setOpenCart, openMenu, setOpenMenu, user, currentList, setCurrentList, currentTab, setCurrentTab }) {
    const navigate = useNavigate();

    const [isDashboard, setIsDashboard] = useState(false)
    const tabs = ['Current orders', 'Borrowing orders', 'Returned orders']
    
    const handleClickButton = (curList) => {
        setCurrentList(curList)
    }

    function HamburgerMenu() {
        return(
            <div className="hamburger-background">
            <div className="hamburger-container">
                <div className="hamburger-item hamburger-item-border" onClick={() => {
                    setOpenMenu(false)
                    setIsDashboard(false)
                    navigate("../", { replace: true })
                }}>Home</div>

                <div className="hamburger-item" onClick={() => {
                    setOpenMenu(false)
                    setIsDashboard(true)
                    navigate("../dashboard", { replace: true })
                }}>{user.email ? "Dash board" : "Login"}</div>

                {isDashboard && (user.email && (user.isAdmin ?
                <div id="hamburger-menu">
                    <h3 className='menu_list_title'>Items, devices</h3>
                    <button
                        className={"hamburger_list_admin " + (currentList === "items" && "chosen")}
                        onClick={() => handleClickButton("items")}
                    >
                        Items
                    </button>

                    <h3 className='menu_list_title'>Users</h3>
                    <button
                        className={"hamburger_list_admin " + (currentList === "users_register" && "chosen")}
                        onClick={() => handleClickButton("users_register")}
                    >
                        Register users
                    </button>

                    <button
                        className={"hamburger_list_admin " + (currentList === "users_all" && "chosen")}
                        onClick={() => handleClickButton("users_all")}
                    >
                        Member
                    </button>

                    <h3 className='menu_list_title'>Oders</h3>
                    <button
                        className={"hamburger_list_admin " + (currentList === "orders_pending" && "chosen")}
                        onClick={() => handleClickButton("orders_pending")}
                    >
                        Pending orders
                    </button>

                    <button
                        className={"hamburger_list_admin " + (currentList === "orders_ok" && "chosen")}
                        onClick={() => handleClickButton("orders_ok")}
                    >
                        Processing orders
                    </button>

                    <button
                        className={"hamburger_list_admin " + (currentList === "orders_complete" && "chosen")}
                        onClick={() => handleClickButton("orders_complete")}
                    >
                        Complete orders
                    </button>

                </div>:
                <div id="hamburger-menu">
                    <h3 className='menu_list_title'>LIST ORDER</h3>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={"hamburger_list_admin " + (currentTab === tab && "chosen")}
                            onClick={() => { setCurrentTab(tab) }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>)

            )}
            </div>
            </div>
        )
    }

    console.log(user)

    return (
        <header id="header" >
            <ul>
                <li className="header-left">
                    <div className='header-logo'>
                        <img src="/small_logo.png" alt="image" />
                    </div>
                    <em className="text-logo-1">Asset</em>
                    <em className="text-logo-2">cse</em>
                </li>
                <li className="header-right">

                    <div className="nav-btn" onClick={() => {
                        navigate("../", { replace: true })
                    }}>Home</div>

                    <div className="nav-btn" onClick={() => {
                        navigate("../dashboard", { replace: true })
                    }}>{user.email ? "Dash board" : "Login"}</div>

                    <a
                        className="checklist-header-nav nav-btn"
                        onClick={
                            (e) => {
                                setOpenCart(!openCart)
                            }
                        }>
                        <i className="fa-solid fa-box-open"></i>
                    </a>
                    {openCart && <Cart />}

                    <a
                        className="checklist-header-nav hamburger-icon"
                        onClick={
                            (e) => {
                                openMenu && setOpenMenu(false)
                                setOpenCart(!openCart)
                            }
                        }>
                        <i className="fa-solid fa-box-open"></i>
                    </a>
                    <a className="hamburger-icon" onClick={()=> {setOpenMenu(!openMenu)}}><i class="fa-solid fa-bars"></i></a>
                    {openMenu && <HamburgerMenu />}

                </li>
            </ul>
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
                        navigate("../", { replace: true })
                    }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <p>Home page</p>
                    </div>
                    <div className="item item_btn" onClick={() => {
                        navigate("../dashboard", { replace: true })
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

