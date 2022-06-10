import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Login from './login';
import '../../styles/auth.css'

export default function AuthPage(props) {

    const navigate = useNavigate()
    const [openLogin, setOpenLogin] = useState(false)

    const handleLoginButtonClick = () => {
        setOpenLogin(true)
    }

    const handleSignupButtonClick = () => {
        navigate("../signup", { replace: true })
    }

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
                <div>
                    <button id="left_button" className="button" onClick={handleLoginButtonClick}>
                        Log in
                    </button>

                    <button className="button" onClick={handleSignupButtonClick}>
                        Sign up
                    </button>
                </div>
            </div>

            {openLogin && <Login setOpenLogin={setOpenLogin} setUser={props.setUser} />}
        </div>


    )
}