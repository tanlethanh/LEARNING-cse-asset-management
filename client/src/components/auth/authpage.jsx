import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'
import Login from './login';
import './auth.css'

export default function AuthPage(props) {

    const [openLogin, setOpenLogin] = useState(false)

    const handleLoginButtonClick = () => {
        setOpenLogin(true)
    }

    const handleSignupButtonClick = () => {
        let navigate = useNavigate()
        navigate("../signup", { replace: true })
    }

    return (
        <div className="authpage_container">
            <h1>Hello AuthPage</h1>

            <button onClick={handleLoginButtonClick}>
                Log in
            </button>
            <button onClick={handleSignupButtonClick}>
                Sign up
            </button>

            {openLogin && <Login setOpenLogin={setOpenLogin} setUser={props.setUser} />}
        </div>

        
    )
}