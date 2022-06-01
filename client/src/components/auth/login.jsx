import React, { useState } from 'react';
import Axios from "axios";
import './auth.css'

export default function Login(props) {

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
                props.setIsLogined(true)
            }
        });


        // fetch("http://localhost:8266/api/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         "password": password,
        //         "email": email
        //     }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data.message);
        //         if (data.user) {
        //             props.setIsLogined(true)
        //         }
        //     })


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