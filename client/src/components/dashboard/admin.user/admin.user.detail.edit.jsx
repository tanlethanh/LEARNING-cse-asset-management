import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Alert from '../../../helpers/alert';
import isValidStudentCode from "../../../utils/isValidStudentCode"
import isValidPhoneNumber from "../../../utils/isValidPhoneNumber"
import isValidPassword from "../../../utils/isValidPassword"
import isValidHcmutEmail from "../../../utils/isValidHcmutEmail"
import '../../../styles/waiting.css'

export default function EditInfo({ user, infor, setInfor, editInforUser, setEditInforUser, isUpdated, setIsUpdated }) {
    const [acceptBox, setAcceptBox] = useState(false)
    const [acceptInfo, setAcceptInfo] = useState('')

    const [error, setError] = useState("invalid")

    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    const [changeInfo, setChangeInfo] = useState('')
    const [waitingLoad, setWaitingLoad] = useState(false)

    const handleSaveButtonClick = () => {
        if (error == "valid") {
            setAcceptInfo(changeInfo)
            setAcceptBox(true)
        }
        else {
            setAlertMess("A value must be valid!")
            setAlert(false)
            setAlert(true)
        }
    }

    useEffect(() => {
        if (((infor === 'password') && (isValidPassword(changeInfo))) ||
            ((infor === 'email') && (isValidHcmutEmail(changeInfo))) ||
            ((infor === 'studentCode') && (isValidStudentCode(changeInfo))) ||
            ((infor === 'phoneNumber') && (isValidPhoneNumber(changeInfo))) ||
            ((infor === 'fullName'))
        ) {
            setError("valid")

        } else {
            setError("invalid")
        }
    }, [changeInfo])

    function AcceptEditInfo() {

        const [adminPassword, setAdminPassword] = useState('')

        const handleYes = () => {
            if (infor === 'fullName') {
                setWaitingLoad(true)
                Axios.patch(`/api/user/${user._id}`, {
                    fullName: acceptInfo,
                    studentCode: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    adminPassword: adminPassword,
                })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data) {
                            setAcceptInfo('')
                            setEditInforUser(false)
                            setAcceptBox(false)
                            setIsUpdated(!isUpdated)

                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    })
            } else if (infor === 'email') {
                setWaitingLoad(true)
                Axios.patch(`/api/user/${user._id}`, {
                    fullName: "",
                    studentCode: "",
                    phoneNumber: "",
                    email: acceptInfo,
                    password: "",
                    adminPassword: adminPassword
                })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data) {
                            setAcceptInfo('')
                            setEditInforUser(false)
                            setAcceptBox(false)
                            setIsUpdated(!isUpdated)
                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    })
            } else if (infor === 'studentCode') {
                setWaitingLoad(true)
                Axios.patch(`/api/user/${user._id}`, {
                    fullName: "",
                    studentCode: acceptInfo,
                    phoneNumber: "",
                    email: "",
                    password: "",
                    adminPassword: adminPassword
                })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data) {
                            setAcceptInfo('')
                            setEditInforUser(false)
                            setAcceptBox(false)
                            setIsUpdated(!isUpdated)
                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    })
            } else if (infor === 'phoneNumber') {
                setWaitingLoad(true)
                Axios.patch(`/api/user/${user._id}`, {
                    fullName: "",
                    studentCode: "",
                    phoneNumber: acceptInfo,
                    email: "",
                    password: "",
                    adminPassword: adminPassword
                })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data) {
                            setAcceptInfo('')
                            setEditInforUser(false)
                            setAcceptBox(false)
                            setIsUpdated(!isUpdated)
                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    })
            } else {
                setWaitingLoad(true)
                Axios.patch(`/api/user/${user._id}`, {
                    fullName: "",
                    studentCode: "",
                    phoneNumber: "",
                    email: "",
                    password: acceptInfo,
                    adminPassword: adminPassword
                })
                    .then((response) => {
                        console.log(response.data)
                        if (response.data) {
                            setAcceptInfo('')
                            setEditInforUser(false)
                            setAcceptBox(false)
                            setIsUpdated(!isUpdated)
                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    })
            }
        }

        return (
            <div className='edit_info_background'>
                {
                    waitingLoad && 
                    <div className="load">
                        <div className="waiting-load">
                            <span className="fa-solid fa-spinner rotate-around icon"></span>
                        </div>
                    </div>
                }
                <div className='edit_info_container'>
                    <div className='edit_info_body'>
                        <label className='lable_body'>Please type your password!</label>
                        <input
                            className='input_body'
                            type="password"
                            onChange={e => {
                                setAdminPassword(e.target.value)
                            }} />
                    </div>

                    <div className='edit_info_footer'>
                        <button className='button yes_button' type="submit" onClick={() => { handleYes() }}>Yes</button>

                        <button className='button no_button' onClick={() => { setAcceptBox(false) }}>
                            No
                        </button>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className='edit_info_background'>
            {
                <Alert
                    type="error"
                    message={alertMess}
                    alert={alert}
                    setAlert={setAlert}
                />
            }
            {
                waitingLoad && 
                <div className="load">
                    <div className="waiting-load">
                        <span className="fa-solid fa-spinner rotate-around icon"></span>
                    </div>
                </div>
            }
            <div className='edit_info_container'>

                <div className='edit_info_body'>
                    <label className='lable_body'>
                        New
                        {infor === 'email' && " email"}
                        {infor === 'studentCode' && " student code"}
                        {infor === 'phoneNumber' && " phone number"}
                        {infor === 'password' && " password"}
                        {infor === 'fullName' && " full name"}
                    </label>

                    <p className={"edit_info_input_" + error}>
                        {(error === 'valid') && (infor != 'fullName' && "valid!")}
                        {(error === 'invalid') && (infor === 'email' && "Please use hcmut email!")}
                        {(error === 'invalid') && (infor === 'studentCode' && "Student code must have 7 digits!")}
                        {(error === 'invalid') && (infor === 'phoneNumber' && "Phone number must be valid Vietnamese phone number!")}
                        {(error === 'invalid') && (infor === 'password' && "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!")}
                    </p>
                    <input
                        className='input_body'
                        type={(infor === 'password' && "password") || "text"}
                        onChange={e => {
                            setChangeInfo(e.target.value)
                        }} />

                </div>

                <div className='edit_info_footer'>
                    <button className='button' type="submit" onClick={handleSaveButtonClick}>Save</button>
                    <button
                        onClick={() => {
                            ;
                            setEditInforUser(false);
                        }}
                        id="cancelBtn"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            {acceptBox && <AcceptEditInfo />}

        </div>
    )
}