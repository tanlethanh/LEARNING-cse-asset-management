import React, { useState } from 'react';
import Login from './login';
import './auth.css'

export default function AuthPage(props) {

    const [openLogin, setOpenLogin] = useState(false)

    const handleLoginButtonClick = () => {
        setOpenLogin(true)
    }

    return (
        <div className="authpage_container">
            <h1>Hello AuthPage</h1>

            <button onClick={handleLoginButtonClick}>
                Login
            </button>

            {openLogin && <Login setOpenLogin={setOpenLogin} setIsLogined={props.setIsLogined} />}
        </div>

        
    )
}