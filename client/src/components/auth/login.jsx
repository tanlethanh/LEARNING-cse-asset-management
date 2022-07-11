import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Alert from '../alert'

export default function Login(props) {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    const login = () => {
        

        Axios.post("/api/auth/login", {
            email: username + "@hcmut.edu.vn",
            password: password,
        }).then((response) => {
            console.log(response.data)
            if (response.data.user) {
                props.setUser(response.data.user)
                navigate("../dashboard", { replace: true })
            }
            else {
                setAlertMess(response.data.message)
                setAlert(false)
                setAlert(true)
            }
        });

    }


    return (
        <div className="login_background">
            {
                <Alert
                    type="error"
                    message={alertMess}
                    alert={alert}
                    setAlert={setAlert}
                />
            }
            <div className="login_container">

                <div className="login_title">
                    <h1 className='login_title_top'>Log in</h1>
                    <div className="login_donthave">
                        <p>Don't have an account?</p>
                        <p onClick={()=>{
                            navigate("../signup", { replace: true })
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

                    <button
                        onClick={() => {
                            props.setOpenLogin(false);
                        }}
                        id="cancelBtn"
                    >
                        Cancel
                    </button>

                </div>

            </div>
        </div>




    )
}