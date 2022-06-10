import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import Member from '../member';

export default function DetailUser() {

    const {state} = useLocation()
    const {user} = state

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
                        <li className="item-infor">ID: {user._id}</li>
                        <li className="item-infor">Email: {user.email}</li>
                        <li className="item-infor">Full name: {user.fullName}</li>
                        <li className="item-infor">Student code: {user.studentCode}</li>
                        <li className="item-infor">Phone number: {user.phoneNumber}</li>
                    </ul>
                    
                </div>
            </div>
            {
                <Member user={user} />
            }
        </div>

    )
}