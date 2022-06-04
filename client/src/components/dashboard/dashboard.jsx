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
    const [editButton, setEditButton]= useState(true)
    const [saveButton, setSaveButton] = useState(false)
    const [logoutButton, setLogoutButton] = useState(true)

    const handleLogoutButtonClick = () => {
        Axios.post("http://localhost:8266/api/auth/logout")
            .then((response) => {
                console.log("Hello logout", response.data)
                props.setUser({})
                navigate("../dashboard", { replace: true })
            })
    }

    const handleEditButtonClick = () => {
        setEditButton(!editButton)
        setSaveButton(!saveButton)
        setLogoutButton(!logoutButton)
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
                    <ul className="list-infor">
                        <li className="item-infor">ID: {props.user._id}</li>
                        <li className="item-infor">Email: {props.user.email}</li>
                        <li className="item-infor">Full name: {props.user.fullName}</li>
                        <li className="item-infor">Student code: {props.user.studentCode}</li>
                        <li className="item-infor">Phone number: {props.user.phoneNumber}</li>
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