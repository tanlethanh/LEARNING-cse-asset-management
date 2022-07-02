import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import Member from '../member';
import EditInfo from './admin.user.detail.edit.jsx';

export default function DetailUser() {

    const {state} = useLocation()
    const { user } = state

    const [editInforUser, setEditInforUser] = useState (false)
    const [infor, setInfor] = useState('')

    const handleButtonEdit = (e) => {
        setInfor(e)
        setEditInforUser(true)
    }

    const navigate = useNavigate()

    const goBack = () => {
        navigate("../dashboard", { replace: true })
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