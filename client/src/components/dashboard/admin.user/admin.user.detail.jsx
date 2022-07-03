import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import Axios from 'axios';
import Admin from '../admin';
import Member from '../member';
import EditInfo from './admin.user.detail.edit.jsx';
import Alert from '../../alert';
import ConfirmPassword from '../../confirmPassword';

export default function DetailUser() {

    const {state} = useLocation()
    const { user } = state

    const [editInforUser, setEditInforUser] = useState (false)
    const [infor, setInfor] = useState('')
    const [confirmPassword, setConfirmPassword] = useState(false)

    // utils
    const [typeAlert, setTypeAlert] = useState("")
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

    function HandlePermission(user){

        function HandleYes(adminPassword){
            Axios.patch(`http://localhost:8266/api/user/${user.user._id}?togglePermission=admin`, {
                adminPassword: adminPassword
            })
                .then(response => {
                    setAlertMess("Successfully!");
                    setTypeAlert("success");
                    setAlert(true);
                    setTimeout(() => {
                        setConfirmPassword(false);
                    }, 1000);
                })
                .catch(error => {

                    if (error.response.status === 403) {
                        setAlertMess("Your password is incorrect!");
                        setTypeAlert("error");
                        setAlert(true);
                        setTimeout(() => {
                            setConfirmPassword(false);
                        }, 1500);
                    }
                    else if (error.response.status === 400) {
                        if (error.response.data.messages.split(" ")[0] === "E11000") {
                            setAlertMess("Please use another name!");
                        }
                        else {
                            setAlertMess("Failure, bad request!");
                        }
                        setTypeAlert("error");
                        setAlert(true);
                        setTimeout(() => {
                            setConfirmPassword(false);
                        }, 1500);
                    }
                    else {
                        setAlertMess("Failure, please check again!");
                        console.log(error);
                        setTypeAlert("error");
                        setAlert(true);
                        setTimeout(() => {
                            setConfirmPassword(false);
                        }, 1500);
                    }
                });
        }

        return (
            <div>
                {
                    <Alert
                        type={typeAlert}
                        message={alertMess}
                        alert={alert}
                        setAlert={setAlert}
                    />
    
                }
                {
                    <ConfirmPassword
                        setOpen={setConfirmPassword}
                        callback={HandleYes}
                    />
                }
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
                        <li className="item-infor edit-user">
                            Permission: {user.isAdmin ? "Admin" : "Member"}
                            <button 
                            className="button-edit" 
                            onClick={()=>{setConfirmPassword(true)}}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                    </ul>

                    {confirmPassword && <HandlePermission user = {user}/>}

                    {editInforUser && 
                    <EditInfo
                        user = {user} 
                        infor = {infor} 
                        setInfor={setInfor} 
                        editInforUser={editInforUser} 
                        setEditInforUser={setEditInforUser}
                    />}
                    
                </div>
            </div>
            {
                <Member user={user} />
            }
        </div>

    )
}