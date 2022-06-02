import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import './auth.css'

export default function Signup() {

    const [email, setEmail] = useState({})
    const [password, setPassword] = useState()
    const [studentCode, setStudentCode] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [fullName, setFullName] = useState("guy!")
    const navigate = useNavigate()

    const register = () => {

        Axios.post("http://localhost:8266/api/auth/login", {
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
        <div className="signup_background">
            <h1 className="">{`Hi ${fullName}`}</h1>
            <div className="signup_container">
                <label>full name</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setFullName(e.target.value);
                    }}
                />
                <label>email</label>
                <input
                    type='email'
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <label>password</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <label>student code</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setStudentCode(e.target.value);
                    }}
                />
                <label>phone</label>
                <input
                    type="number"
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                    }}
                />
                <button onClick={register}> Register </button>
            </div>
        </div>
    )
}