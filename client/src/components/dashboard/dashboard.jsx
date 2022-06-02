import React from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'
import Admin from './admin';
import Member from './member';

export default function Dashboard(props) {

    const navigate = useNavigate()

    const handleLogoutButtonClick = () => {
        Axios.post("http://localhost:8266/api/auth/logout")
            .then((response) => {
                console.log(response.data)
                props.setUser({})
                navigate("../dashboard", { replace: true })
            })
    }

    return (
        <div className="dashboard_container">
            <div id="information">
                <div class="title">
                    <h1 class="name">
                        {props.user.fullName}
                    </h1>
                    <h2 class="description">
                        {props.user.isAdmin ? "Admin" : "Member"}
                    </h2>
                </div>
                <div class="detail">
                    <ul class="list-infor">
                        <li class="item-infor">ID: {props.user._id}</li>
                        <li class="item-infor">Email: {props.user.email}</li>
                        <li class="item-infor">Full name: {props.user.fullName}</li>
                        <li class="item-infor">Student code: {props.user.studentCode}</li>
                        <li class="item-infor">Phone number: {props.user.phoneNumber}</li>
                        <button className="" onClick={handleLogoutButtonClick}>Log out</button>
                    </ul>
                </div>
            </div>
            {props.user.isAdmin ? <Admin /> : <Member />}
        </div>

    )
}