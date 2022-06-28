import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import Axios from 'axios';
import Member from '../member';
import Alert from '../../alert';
import isValidStudentCode from "../../../utils/isValidStudentCode"
import isValidPhoneNumber from "../../../utils/isValidPhoneNumber"
import isValidPassword from "../../../utils/isValidPassword"
import isValidHcmutEmail from "../../../utils/isValidHcmutEmail"

export default function DetailUser() {

    const {state} = useLocation()
    const { user } = state

    const [editInforUser, setEditInforUser] = useState (false)
    const [infor, setInfor] = useState('')
    const [acceptBox, setAcceptBox] = useState(false)
    const [acceptInfo, setAcceptInfo] = useState('')

    const [error, setError] = useState("invalid")

    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    const handleButtonEdit = (e) => {
        setInfor(e)
        setEditInforUser(true)
    }

    const navigate = useNavigate()

    const goBack = () => {
        navigate("../dashboard", { replace: true })
    }

    function AcceptFixInfo() {

        const [adminPassword, setAdminPassword] = useState('')

        const handleYes = () => {
            console.log(user)
            Axios.post("http://localhost:8266/api/auth/login", {
                email: user.email,
                password: adminPassword,
            })
            .then ((response) => {
                console.log(response.data)
                if (response.data.user) {
                    if (infor === 'fulName') {
                        user.fullName = acceptInfo
                    }
                    if (infor === 'email'){
                        user.email = acceptInfo
                    } else if (infor === 'studentCode') {
                        user.studentCode = acceptInfo
                    } else if (infor === 'phoneNumber') {
                        user.phoneNumber = acceptInfo
                    } else {

                    }
                    setInfor('')
                    setAcceptInfo('')
                    setEditInforUser(false)
                    setAcceptBox(false)
                } else {
                    setAlertMess("Wrong password!")
                    setAlert(false)
                    setAlert(true)
                }
            })
        }

        return (
            <div className='edit_info_background'>
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
                        <button className='button yes_button' type="submit" onClick={() =>{handleYes()}}>Yes</button>
                        
                        <button className='button no_button' onClick={()=>{setAcceptBox(false)}}>
                            No
                        </button>
                    </div>
                    
                </div>
            </div>
        )
    } 

    function EditInfo() {

        const [changeInfo, setChangeInfo] = useState('')


        const handleSaveButtonClick = () => {
            if (error == "valid"){
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
                            {(error=== 'invalid') && (infor === 'email' && "Please use hcmut email!")}
                            {(error=== 'invalid') && (infor === 'studentCode' && "Student code must have 7 digits!")}
                            {(error=== 'invalid') && (infor === 'phoneNumber' && "Phone number must be valid Vietnamese phone number!")}
                            {(error=== 'invalid') && (infor === 'password' && "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!")}
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
                            setInfor('');
                            setEditInforUser(false);
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

    return (
        <div className="dashboard_container">
            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {user.fullName}
                    </h1>
                    <h2 className="description">
                        {user.isAdmin ? "Admin" : "Member"}
                    </h2>
                    <button className="button-info" onClick={goBack}>Go back</button>
                </div>
                <div className="detail">

                    <ul className="list-infor">
                        {/* <li className="item-infor">ID: {user._id}</li> */}
                        <li className="item-infor edit-user">
                            Email: {user.email}
                            <button 
                            className="button-edit" 
                            onClick={()=>{handleButtonEdit('email')}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Full name: {user.fullName}
                            <button 
                            className="button-edit" 
                            onClick={()=>{handleButtonEdit('fullName')}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Student code: {user.studentCode}
                            <button 
                            className="button-edit" 
                            onClick={()=>{handleButtonEdit('studentCode')}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>    
                        </li>
                        <li className="item-infor edit-user">
                            Phone number: {user.phoneNumber}
                            <button 
                            className="button-edit" 
                            onClick={()=>{handleButtonEdit('phoneNumber')}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Password: ********
                            <button 
                            className="button-edit" 
                            onClick={()=>{handleButtonEdit('password')}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                    </ul>

                    {editInforUser && <EditInfo />}
                    {acceptBox && <AcceptFixInfo />}
                    
                </div>
            </div>
            {
                <Member user={user} />
            }
        </div>

    )
}