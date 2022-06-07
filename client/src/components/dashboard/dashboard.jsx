import React, { useState } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../styles/admin.css'
import '../../styles/dashboard.css'
import './dashboard.css'
import Admin from './admin';
import Member from './member';

export default function Dashboard(props) {

    const navigate = useNavigate()

    const [error, setError] = useState(false)
    const [editButton, setEditButton]= useState(true)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    

    const handleLogoutButtonClick = () => {
        Axios.post("http://localhost:8266/api/auth/logout")
            .then((response) => {
                console.log("Hello logout", response.data)
                props.setUser({})
                navigate("../dashboard", { replace: true })
            })
    }

    const handleEditButtonClick = () => {
        setEditButton(false)
    }

    const handleSaveButtonClick = () => {
        if (!editButton) {
            Axios.post("http://localhost:8266/api/auth/login", {
            email: props.user.email,
            password: oldPassword,
            })
            
            .then((response) => {
                if (response.data.user && newPassword == confirmPassword) {
                    setError(false)
                    setEditButton(true)
                    Axios.post("http://localhost:8266/api/auth/password", {
                    newPassword: newPassword,
                    })
                    .then((response) => {
                        console.log(response.data.message)
                        navigate("../dashboard", { replace: true })
                    });
                } else {
                    setError(true)
                    setEditButton(false)
                }
            });
        }    
    }

    return (
        <div className="dashboard_container">
            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {props.user.fullName}
                    </h1>
                    <h2 className="description">
                        {props.user.isAdmin ? "Admin" : "Member"}
                    </h2>
                </div>
                <div className="detail">
                    <ul className="title_list-infor">
                        <li className="title_item-infor">ID: </li>
                        <li className="title_item-infor">Email: </li>
                        <li className="title_item-infor">Full name: </li>
                        <li className="title_item-infor">Student code: </li>
                        <li className="title_item-infor">Phone number: </li>
                    </ul>
                    <ul className="list-infor">
                        <li className="item-infor">{props.user._id}</li>
                        <li className="item-infor">{props.user.email}</li>
                        <li className="item-infor">{props.user.fullName}</li>
                        <li className="item-infor">{props.user.studentCode}</li>
                        <li className="item-infor">{props.user.phoneNumber}</li>
                        {editButton && <button className="button-info" onClick={handleEditButtonClick}>Edit</button>}
                        {saveButton && <button className="button-info" onClick={handleEditButtonClick}>Save</button>}
                        {logoutButton && <button className="button-info">Log out</button>}
                    </ul>
                </div>
            </div>
            {
                props.user.isAdmin ?
                    <Admin setUser={props.setUser} user={props.user} /> :
                    <Member setUser={props.setUser} user={props.user} />
            }
        </div>

    )
}