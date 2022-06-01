import React, { useState } from "react"
import './auth.css'

export default function Signup() {

    const [email, setEmail] = useState({})
    const [password, setPassword] = useState()
    const [studentCode, setStudentCode] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [fullName, setFullName] = useState("None")

    const register = () => {
        fetch("http://localhost:8266/api/auth/register", {
            method: "POST",
            credentials: 'same-origin',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "password": password,
                "fullName": fullName,
                "studentCode": studentCode,
                "phoneNumber": phoneNumber,
                "email": email
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // setUser(data)
            })
    }

    return (
        <div >
            <h1 className="">{`Hello ${fullName}`}</h1>
            <div className="signup">
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