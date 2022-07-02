import React, { useContext, useState } from 'react';
import '../../styles/headerfooter.css'
import { useNavigate } from 'react-router-dom';
import Cart from './cart';

export function Header() {
    const navigate = useNavigate();
    const [openCart, setOpenCart] = useState(false)

    return (
        <header id="header" onClick={(e)=>{
            const currentClass = e.target.className
            const parentClass = e.target.parentNode.className
            const parent2Class = e.target.parentNode.parentNode.className
            // const parent3Class = e.target.parentNode.parentNode.parentNode.className
            // const parent4Class = e.target.parentNode.parentNode.parentNode.parentNode.className
            // const parent5Class = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.className

            // console.log(currentClass)
            // console.log(parentClass)
            // console.log(parent2Class)
            // console.log(parent3Class)
            // console.log(parent4Class)
            // console.log(parent5Class)
            // console.log(parentClass)
            
            if (
                currentClass.split('-')[0] !== 'checklist'
                && parentClass.split('-')[0] !== 'checklist'
                && parent2Class.split('-')[0] !== 'checklist'
            ) {
                setOpenCart(false)
            }
        }}>
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

