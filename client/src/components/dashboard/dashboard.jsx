import React, { useState } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../styles/admin.css'
import '../../styles/dashboard.css'
import './dashboard.css'
import Admin from './admin';
import Member from './member';
import EditInfo from './editInfo';

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
                if (response.data.message == "Login successfully!" && newPassword == confirmPassword) {
                    setError(false)
                    setEditButton(true)
                    Axios.post("http://localhost:8266/api/auth/password", {
                    newPassword: newPassword,
                    })
                    .then((response) => {
                        console.log("succeed")
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
                    {editButton && 
                    <ul className="list-infor">
                        <li className="item-infor">ID: {props.user._id}</li>
                        <li className="item-infor">Email: {props.user.email}</li>
                        <li className="item-infor">Full name: {props.user.fullName}</li>
                        <li className="item-infor">Student code: {props.user.studentCode}</li>
                        <li className="item-infor">Phone number: {props.user.phoneNumber}</li>
                    </ul>}
                    {!editButton && 
                    <ul className="list-infor edit-pass">
                        <li className="item-infor">
                        <label>Old password: </label>
                        <input type="text" onChange={e =>setOldPassword(e.target.value)}/>
                        </li>

                        <li className="item-infor">
                        <label>New password: </label>
                        <input type="text" onChange={e =>setNewPassword(e.target.value)}/>
                        </li>

                        <li className="item-infor">
                        <label>Confirm password: </label>
                        <input type="text" onChange={e =>setConfirmPassword(e.target.value)}/>
                        </li> 
                    </ul>}
                    {error && <div>Wrong old password or confirm password.<br/>Please type again!</div>}
                    {editButton && <button className="button-info" onClick={handleLogoutButtonClick}>Log out</button>}
                    {editButton && <button className="button-info" onClick={handleEditButtonClick}>Edit</button>}
                    {!editButton && <button className="button-info" onClick={handleSaveButtonClick}>Save</button>}
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