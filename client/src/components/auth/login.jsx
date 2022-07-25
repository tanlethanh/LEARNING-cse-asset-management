import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { AppContext } from '../../App'


export default function Login({ setUser }) {

    const { helpers } = useContext(AppContext);

    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {

        Axios.post("/api/auth/login", {
            email: username + "@hcmut.edu.vn",
            password: password,
        })
            .then((response) => {
                setUser(response.data.user)
                navigate("../mylist")
            })
            .catch((error) => {
                helpers.setAlert(
                    {
                        type: "error",
                        message: error.response.data.message
                    }
                )
                helpers.setOpenAlert(true)
            })

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
            </div>
            <div className="login_background">
                <div className="login_container">

                    <div className="login_title">
                        <h1 className='login_title_top'>Log in</h1>
                        <div className="login_donthave">
                            <p>Don't have an account?</p>
                            <p onClick={() => {
                                navigate("../signup")
                            }} id="link_login">Sign up now</p>
                        </div>
                    </div>

                    <div className="login_body">

                        <label className="label_login_body">User name</label>
                        <p className={"signup_input_invalid"}>
                            Prefix of your hcmut email!
                        </p>
                        <input className="input_login_body" type="text" onChange={e => {
                            setUsername(e.target.value)
                        }} />

                        <label className="label_login_body">Password</label>
                        <input
                            className="input_login_body"
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                    </div>

                    <div className="login_footer">

                        <button type="submit" onClick={login}>Login</button>


                    </div>

                </div>
            </div>
        </div>


    )
}