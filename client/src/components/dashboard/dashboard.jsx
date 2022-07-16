import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../styles/admin.css'
import '../../styles/dashboard.css'
import '../../styles/button.scss'
import '../../styles/waiting.css'
import isValidPassword from '../../utils/isValidPassword';
import Admin from './admin';
import Member from './member';
import Alert from '../alert';
import Statistic from './statistic';

export default function Dashboard(props) {

    const navigate = useNavigate()

    const [editButton, setEditButton] = useState(false)
    const [adminData, setAdminData] = useState({})
    const [waitingLoad, setWaitingLoad] = useState(false)

    const handleLogoutButtonClick = () => {
        setWaitingLoad(true)
        Axios.post("/api/auth/logout")
            .then((response) => {
                console.log("Hello logout", response.data)
                props.setUser({})
                navigate("../dashboard", { replace: true })
                setWaitingLoad(false)
            })
    }

    function EditInfo() {
        const [oldPassword, setOldPassword] = useState('')
        const [newPassword, setNewPassword] = useState('')
        const [confirmPassword, setConfirmPassword] = useState('')

        const [errorPassword, setErrorPassword] = useState("invalid")

        const [alert, setAlert] = useState(false)
        const [alertMess, setAlertMess] = useState('')


        const handleSaveButtonClick = () => {
            if (oldPassword !== '' && newPassword !== '' && oldPassword !== '') {
                setWaitingLoad(true)
                Axios.post("/api/auth/login", {
                    email: props.user.email,
                    password: oldPassword,
                })

                    .then((response) => {
                        console.log(response.data)
                        if (response.data.user && newPassword === confirmPassword && errorPassword === "valid") {
                            Axios.post("/api/auth/password", {
                                newPassword: newPassword,
                            })
                                .then((response) => {
                                    console.log(response.data.message)
                                    navigate("../dashboard", { replace: true })
                                });
                            setEditButton(false)
                        } else {
                            setAlertMess("Wrong password!")
                            setAlert(false)
                            setAlert(true)
                        }
                        setWaitingLoad(false)
                    });
            } else {
                setAlertMess("All fields must be valid!")
                setAlert(false)
                setAlert(true)
            }
        }

        useEffect(() => {
            if (isValidPassword(newPassword)) {
                setErrorPassword("valid")

            } else {
                setErrorPassword("invalid")
            }


        }, [newPassword])

        return (
            <div className='change_password_background'>
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
                    <body className="load">
                        <div className="waiting-load">
                            <span className="fa-solid fa-spinner rotate-around icon"></span>
                        </div>
                    </body>
                }
                <div className='change_password_container'>

                    <div className='change_password_body'>
                        <label className='lable_body'>Old Password</label>
                        <input className='input_body' type="password" onChange={e => {
                            setOldPassword(e.target.value)
                        }} />

                        <label className='lable_body'>New Password</label>
                        <p className={"change_password_input_" + errorPassword}>
                            {(errorPassword === 'valid') && "Your password is valid!"}
                            {(errorPassword === 'invalid') &&
                                "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!"}
                        </p>
                        <input className='input_body' type="password" onChange={e => {
                            setNewPassword(e.target.value)
                        }} />

                        <label className='lable_body'>Confirm Password</label>
                        <input className='input_body' type="password" onChange={e => {
                            setConfirmPassword(e.target.value)
                        }} />

                    </div>

                    <div className='change_password_footer'>
                        <button className='button' type="submit" onClick={handleSaveButtonClick}>Save</button>
                        <button
                            onClick={() => {
                                setEditButton(false);
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

    function handleProfileButton(user) {
        navigate("./me")
    }

    const goBack = () => {
        navigate("../dashboard", { replace: true })
    }

    return (
        <div className="dashboard_container">
            {
                waitingLoad && 
                <body className="load">
                    <div className="waiting-load">
                        <span className="fa-solid fa-spinner rotate-around icon"></span>
                    </div>
                </body>
            }
            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {props.user.fullName}
                    </h1>
                    <h2 className="description">
                        {props.user.isAdmin ? "Admin" : "Member"}
                    </h2>
                    {props.user.isAdmin && !props.adminSite && <button className="button-info" onClick={goBack}>Go back</button>}
                </div>

                <div className="detail">
                    {props.user.isAdmin && props.adminSite ?
                        <Statistic data={adminData} />
                        : <ul className="list-infor">
                            {/* <li className="item-infor">ID: {props.user._id}</li> */}
                            <li className="item-infor">Email: {props.user.email}</li>
                            <li className="item-infor">Full name: {props.user.fullName}</li>
                            <li className="item-infor">Student code: {props.user.studentCode}</li>
                            <li className="item-infor">Phone number: {props.user.phoneNumber}</li>
                        </ul>}

                    <div className="information_button_container">
                        {props.user.isAdmin && props.adminSite ?
                            <button className="button-info" onClick={() => { handleProfileButton(props.user) }}>Profile</button> :
                            <button className="button-info" onClick={() => { setEditButton(true) }}>Edit</button>}
                        <button className="button-info" onClick={handleLogoutButtonClick}>Log out</button>
                    </div>
                    {editButton && <EditInfo />}
                </div>

            </div>
            {editButton && <EditInfo />}
            {
                props.user.isAdmin && props.adminSite ?
                    <Admin 
                        setUser={props.setUser} 
                        user={props.user} 
                        setAdminData={setAdminData} 
                        currentList={props.currentList} 
                        setCurrentList={props.setCurrentList} 
                    /> :
                    <Member 
                        setUser={props.setUser} 
                        user={props.user} 
                        currentTab={props.currentTab}
                        setCurrentTab={props.setCurrentTab}
                    />
            }
        </div>

    )
}