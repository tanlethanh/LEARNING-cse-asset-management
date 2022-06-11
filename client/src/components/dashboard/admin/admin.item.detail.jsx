import React, { useState } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Member from '../member';

export default function DetailItem(props) {
    const user = props.navigation.state.user

    const navigate = useNavigate()

    const [error, setError] = useState(false)
    const [editButton, setEditButton]= useState(true)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const toggleEditForm = () => {
        setEditButton(!editButton)
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
                        {user.fullName}
                    </h1>
                    <h2 className="description">
                        {user.isAdmin ? "Admin" : "Member"}
                    </h2>
                </div>
                <div className="detail">
                    {editButton && 
                    <ul className="list-infor">
                        <li className="item-infor">ID: {user._id}</li>
                        <li className="item-infor">Email: {user.email}</li>
                        <li className="item-infor">Full name: {user.fullName}</li>
                        <li className="item-infor">Student code: {user.studentCode}</li>
                        <li className="item-infor">Phone number: {user.phoneNumber}</li>
                    </ul>}
                    {!editButton && 
                    <ul className="list-infor edit-pass">
                        <li className="item-infor">
                        <label>Old password: </label>
                        <input type="password" onChange={e =>setOldPassword(e.target.value)}/>
                        </li>

                        <li className="item-infor">
                        <label>New password: </label>
                        <input type="password" onChange={e =>setNewPassword(e.target.value)}/>
                        </li>

                        <li className="item-infor">
                        <label>Confirm password: </label>
                        <input type="password" onChange={e =>setConfirmPassword(e.target.value)}/>
                        </li> 
                    </ul>}
                    {error && <div>Wrong old password or confirm password.<br/>Please type again!</div>}
                    {editButton && <button className="button-info" onClick={toggleEditForm}>Edit</button>}
                    {!editButton && <button className="button-info" onClick={toggleEditForm}>Close</button>}
                    {!editButton && <button className="button-info" onClick={handleSaveButtonClick}>Save</button>}
                </div>
            </div>
            {
                <Member user={user} />
            }
        </div>

    )
}