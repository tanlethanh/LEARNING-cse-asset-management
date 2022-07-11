import React, { useState } from 'react';
import '../../styles/headerfooter.css'
import { useNavigate } from 'react-router-dom';
import Cart from './cart';

export function Header({ openCart, setOpenCart, openMenu, setOpenMenu }) {
    const navigate = useNavigate();

    function HamburgerMenu() {
        return(
            <div className="hamburger-container">
                <div className="hamburger-item hamburger-border" onClick={() => {
                    navigate("../", { replace: true })
                }}>Home</div>

                <div className="hamburger-item hamburger-border" onClick={() => {
                    navigate("../dashboard", { replace: true })
                }}>Dash board</div>

                <div className="hamburger-icon">
                    <a
                        className="checklist-header-nav hamburger-icon"
                        onClick={
                            (e) => {
                                setOpenMenu(!openMenu)
                                setOpenCart(!openCart)
                            }
                        }>
                        <i className="fa-solid fa-box-open"></i>
                    </a>
                </div>
            </div>
        )
    }

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
                    }}>Dash board</div>

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

