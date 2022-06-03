import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function Login(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        console.log(email, password)

        Axios.post("http://localhost:8266/api/auth/login", {
            email: email,
            password: password,
        }).then((response) => {

            console.log(response.data.message)

            if (response.data.user) {
                props.setUser(response.data.user)
                // props.setIsLogined(true)
                navigate("../dashboard", { replace: true })
            }
        });

    }


    return (
        <div className="login_background">
            <div className="login_container">

                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            props.setOpenLogin(false);
                        }}
                    >
                        X
                    </button>
                </div>

                <div className="login_title">
                    <h1>Login</h1>
                </div>

                <div className="login_body">

                    <label>email</label>
                    <input type="text" onChange={e => {
                        setEmail(e.target.value)
                    }} />

                    <label>password</label>
                    <input type="password" onChange={e => {
                        setPassword(e.target.value)
                    }} />

                </div>

                <div className="login_footer">

                    <button
                        onClick={() => {
                            props.setOpenLogin(false);
                        }}
                        id="cancelBtn"
                    >
                        Cancel
                    </button>

                    <button type="submit" onClick={login}>Login</button>
                </div>

            </div>
        </div>




    )
}