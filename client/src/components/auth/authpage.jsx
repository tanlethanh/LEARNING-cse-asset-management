import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Login from './login';
import '../../styles/auth.css'

export default function AuthPage(props) {

    const navigate = useNavigate()

    return (
        <div className="authpage_container">
            <div className="authpage_container_left">
                <h2>WELCOME TO...</h2>
                <div className="title_authpage_container_left">
                    <h1>CSE</h1>
                    <h1>ASSET </h1>
                    <h1>MANAGER</h1>
                </div>
                <p>This website manages CSE's assets. You can register to borrow and return equipment here.</p>
            </div>
            {/*<img className="signup_logo" src="/big_logo.png" alt="" />*/}
            <Login setUser={props.setUser} />
        </div>


    )
}