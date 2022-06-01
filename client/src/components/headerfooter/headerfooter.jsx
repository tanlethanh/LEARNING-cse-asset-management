import React from 'react';
import { Link } from "react-router-dom";
import './headerfooter.css'

export function Header(props) {
    return (
        <header id="header">
            <ul>
                <li className="header-left">
                    <a className="text-logo">
                        <em className="text-logo-1">Asset</em>
                        <em className="text-logo-2">cse</em>
                    </a>
                </li>
                <li className="header-right">
                    <Link className="nav-btn" to={'/'}>Home</Link>
                    <Link className="nav-btn" to={'/dashboard'}>Dash board</Link>
                    <a className="nav-btn"><i className="fa-solid fa-box-open"></i></a>
                </li>
            </ul>
        </header>
    )
}

export function Footer() {
    return (
        <footer className="footer">
            <div className="top_footer">
                <div className="info">
                    <h3 className="footer-title">Information</h3>
                    <p>...</p>
                </div>
                <div className="navi">
                    <h3 className="footer-title">Navigation</h3>
                    <Link className="item" to={'/'}>
                        <i className="fa-solid fa-angle-right"></i>
                        <p>Home page</p>
                    </Link>
                    <Link className="item" to={'/dashboard'}>
                        <i className="fa-solid fa-angle-right"></i>
                        <p>Dash board </p>
                    </Link>
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

