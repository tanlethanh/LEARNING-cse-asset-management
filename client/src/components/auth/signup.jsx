import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import '../../styles/auth.css'

export default function Signup() {

    const [email, setEmail] = useState({})
    const [password, setPassword] = useState()
    const [studentCode, setStudentCode] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [fullName, setFullName] = useState("guy!")
    const navigate = useNavigate()

    const register = () => {

        Axios.post("http://localhost:8266/api/auth/register", {
            password: password,
            fullName: fullName,
            studentCode: studentCode,
            phoneNumber: phoneNumber,
            email: email,
        }).then((response) => {

            console.log(response.data.message)

            if (response.data.user) {
                navigate("../", { replace: true })
            }
        });

    }

    return (
        <div className="signup_background_container_container">
            <div className="signup_background_container">

                    {/* left */}
                    <div className="signup_background_left">
                        <img src="C:\Users\LAPTOP MSI\Desktop\Sign_up\CSE-Asset-Manager\client\src\components\auth\image\imgg.png" alt="" />
                        <h1>ASSET CSE</h1>
                        <p>A powerful website for asset management</p>
                    </div>

                    {/* right */}
                    <div className="signup_background_right">
                        <div className="title_signup_background_right">
                            <h1>Sign up</h1>
                        </div>
                        
                        {/* <h1 className="">{`Hi ${fullName}`}</h1> */}

                        <div className="signup_alhave">
                            <p>Already have an acount?</p> <a id="link_signin" href="">Sign in</a>
                        </div>                  
                                <label>Full name</label>
                                <input
                                    className="input_signup_background_right"
                                    type="text"
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                    }}
                                />                                                  
                                <label>Email</label>
                                <input
                                    className="input_signup_background_right"
                                    type='email'
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />                                        
                                <label>Password</label>
                                <input
                                    className="input_signup_background_right"
                                    type="text"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />                                              
                                <label>Student code</label>
                                <input
                                    className="input_signup_background_right"
                                    type="text"
                                    onChange={(e) => {
                                        setStudentCode(e.target.value);
                                    }}
                                />                         
                                <label>Phone</label>
                                <input
                                    className="input_signup_background_right"
                                    type="number"
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                    }}
                                />
                            <button className="button_signup_container" onClick={register}> Register </button>
                    </div>
            </div>
        </div>
    )
}