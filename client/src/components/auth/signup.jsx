import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import '../../styles/auth.css'
import Alert from '../../helpers/alert'
import isValidStudentCode from "../../utils/isValidStudentCode"
import isValidPhoneNumber from "../../utils/isValidPhoneNumber"
import isValidPassword from "../../utils/isValidPassword"
import isValidHcmutEmail from "../../utils/isValidHcmutEmail"
import convertValidName from "../../utils/convertValidName"

export default function Signup() {
    // use for information about the user
    const [email, setEmail] = useState({})
    const [password, setPassword] = useState("")
    const [studentCode, setStudentCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullName, setFullName] = useState("")

    // to validate the user input
    const [errorStudentCode, setErrorStudentCode] = useState("not_enough_digits")
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("invalid")
    const [errorPassword, setErrorPassword] = useState("invalid")
    const [errorEmail, setErrorEmail] = useState("invalid")

    // to open and close the alert
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    // to navigate to the dashboard
    const navigate = useNavigate()

    const register = () => {

        if (
            isValidStudentCode(studentCode) === false ||
            isValidPhoneNumber(phoneNumber) === false ||
            isValidPassword(password) === false ||
            isValidHcmutEmail(email) === false
        ) {
            setAlertMess("All fields must be valid!")
            setAlert(false)
            setAlert(true)
        }
        else {
            Axios.post("/api/auth/register", {
                password: password,
                fullName: convertValidName(fullName),
                studentCode: studentCode,
                phoneNumber: phoneNumber,
                email: email,
            })
                .then((response) => {
                    if (response.data.user) {
                        navigate("../", { replace: true })
                    }
                })
                .catch((err) => {
                    setAlertMess(err.response.data.message)
                    setAlert(false)
                    setAlert(true)
                });

        }


    }

    useEffect(() => {
        if (studentCode.length === 7) {
            if (!isValidStudentCode(studentCode)) {
                setErrorStudentCode("invalid")

            }
            else {
                setErrorStudentCode("valid")

            }
        }
        else {
            setErrorStudentCode("not_enough_digits")
        }
    }, [studentCode])

    useEffect(() => {
        if (isValidPhoneNumber(phoneNumber)) {
            setErrorPhoneNumber("valid")

        } else {
            setErrorPhoneNumber("invalid")
        }


    }, [phoneNumber])


    useEffect(() => {
        if (isValidPassword(password)) {
            setErrorPassword("valid")

        } else {
            setErrorPassword("invalid")
        }


    }, [password])

    useEffect(() => {
        if (isValidHcmutEmail(email)) {
            setErrorEmail("valid")

        } else {
            setErrorEmail("invalid")
        }


    }, [email])


    return (
        <div className="signup_background_container_container">
            {
                <Alert
                    type="error"
                    message={alertMess}
                    alert={alert}
                    setAlert={setAlert}
                />
            }
            <div className="signup_background_container">

                {/* left */}
                <div className="signup_background_left">
                    <img className="signup_logo" src="/big_logo.png" alt="" />
                    <h1>ASSET CSE</h1>
                    <p>A powerful website for asset management</p>
                </div>

                {/* right */}
                <div className="signup_background_right">
                    <div className="title_signup_background_right">
                        <h1>Sign up</h1>
                    </div>

                    <div className="signup_alhave">
                        <p>Already have an acount?</p> <p id="link_signin" onClick={() => {
                            navigate("../dashboard", { replace: true })
                        }}>Sign in</p>
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
                    <p className={"signup_input_" + errorEmail}>
                        {(errorEmail === 'valid') && "Your email is valid!"}
                        {(errorEmail === 'invalid') && "Please use hcmut email!"}
                    </p>
                    <input
                        className="input_signup_background_right"
                        type='text'
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <label>Password</label>
                    <p className={"signup_input_" + errorPassword}>
                        {(errorPassword === 'valid') && "Your password is valid!"}
                        {(errorPassword === 'invalid') &&
                            "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"
                        }
                    </p>
                    <input
                        className="input_signup_background_right"
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <label>Student code</label>
                    <p className={"signup_studentcode_" + errorStudentCode}>
                        {(errorStudentCode === 'valid') && "Student code is valid!"}
                        {(errorStudentCode === 'invalid') && "Student code is invalid!"}
                        {(errorStudentCode === 'not_enough_digits') && "Student code must have 7 digits!"}
                    </p>
                    <input
                        className="input_signup_background_right"
                        type="text"
                        onChange={(e) => {
                            setStudentCode(e.target.value);
                        }}
                    />
                    <label>Phone number</label>
                    <p className={"signup_input_" + errorPhoneNumber}>
                        {(errorPhoneNumber === 'valid') && "Your phone number is valid!"}
                        {(errorPhoneNumber === 'invalid') && "Phone number must be valid Vietnamese phone number!"}
                    </p>
                    <input
                        className="input_signup_background_right"
                        type="text"
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