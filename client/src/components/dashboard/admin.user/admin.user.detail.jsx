import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import Admin from '../admin';
import Member from '../member';
import EditInfo from './admin.user.detail.edit.jsx';
import Alert from '../../alert';
import ConfirmPassword from '../../confirmPassword';

export default function DetailUser({ admin }) {

    const [user, setUser] = useState({})
    const [isUpdated, setIsUpdated] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        Axios.get(`http://localhost:8266/api/user/${id}`)
            .then(response => {
                // console.log(response.data.user)
                setUser(response.data.user)
            })
            .catch(error => {
                // console.log(error)
            })
    }, [isUpdated])

    const [infor, setInfor] = useState('')
    const [editInforUser, setEditInforUser] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [confirmPermission, setConfirmPermission] = useState(false)

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

    function HandlePermission({ user }) {

        function HandleYes(adminPassword) {
            Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=admin`, {
                adminPassword: adminPassword
            })
                .then(response => {
                    setAlertMess("Successfully!");
                    setTypeAlert("success");
                    setAlert(true);
                    setTimeout(() => {
                        setConfirmPermission(false);
                        setIsUpdated(!isUpdated)
                    }, 1000);
                })
                .catch(error => {

                    if (error.response.status === 403) {
                        setAlertMess("Your password is incorrect!");
                        setTypeAlert("error");
                        setAlert(true);
                        setTimeout(() => {
                            setConfirmPermission(false);
                        }, 1000);
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
                            setConfirmPermission(false);
                        }, 1000);
                    }
                    else {
                        setAlertMess("Failure, please check again!");
                        // console.log(error);
                        setTypeAlert("error");
                        setAlert(true);
                        setTimeout(() => {
                            setConfirmPermission(false);
                        }, 1000);
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
                        setOpen={setConfirmPermission}
                        callback={HandleYes}
                    />
                }
            </div>
        )
    }

    function HandleDelete({ admin, user }) {

        function HandleYes(adminPassword) {
            Axios.post(`http://localhost:8266/api/auth/login`, {
                password: adminPassword,
                email: admin.email
            })
                .then(responseConfirmAdmin => {
                    // console.log("admin confirm successfully")
                    Axios.delete(`http://localhost:8266/api/user/${user._id}`)
                        .then((response) => {
                            // console.log("delete success")
                            setAlertMess("Successfully!");
                            setTypeAlert("success");
                            setAlert(true);
                            setTimeout(() => {
                                navigate("../dashboard", { replace: true })
                                setConfirmDelete(false);
                            }, 1000);
                        })
                        .catch((error) => {
                            setAlertMess(error.response.data.messages)
                            setTypeAlert("error")
                            setAlert(true)
                            setTimeout(() => {
                                setConfirmDelete(false)
                            }, 1000)
                        })

                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        setAlertMess("Your password is incorrect!")
                        setTypeAlert("error")
                        setAlert(true)
                        setTimeout(() => {
                            setConfirmDelete(false)
                        }, 1000)
                    }
                })

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
                        setOpen={setConfirmDelete}
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
                    <button className="button-info delete_button" onClick={() => setConfirmDelete(true)}>Delete</button>
                    <button className="button-info" onClick={goBack}>Go back</button>
                </div>
                <div className="detail">

                    <ul className="list-infor">
                        {/* <li className="item-infor">ID: {user._id}</li> */}
                        <li className="item-infor edit-user">
                            Email: {user.email}
                            <button
                                className="button-edit"
                                onClick={() => { handleButtonEdit('email') }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Full name: {user.fullName}
                            <button
                                className="button-edit"
                                onClick={() => { handleButtonEdit('fullName') }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Student code: {user.studentCode}
                            <button
                                className="button-edit"
                                onClick={() => { handleButtonEdit('studentCode') }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Phone number: {user.phoneNumber}
                            <button
                                className="button-edit"
                                onClick={() => { handleButtonEdit('phoneNumber') }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Password: ********
                            <button
                                className="button-edit"
                                onClick={() => { handleButtonEdit('password') }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                        <li className="item-infor edit-user">
                            Permission: {user.isAdmin ? "Admin" : "Member"}
                            <button
                                className="button-edit"
                                onClick={() => { setConfirmPermission(true) }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </li>
                    </ul>

                    {confirmPermission && <HandlePermission user={user} />}
                    {confirmDelete && <HandleDelete admin={admin} user={user} />}

                    {editInforUser &&
                        <EditInfo
                            user={user}
                            infor={infor}
                            setInfor={setInfor}
                            editInforUser={editInforUser}
                            setEditInforUser={setEditInforUser}
                            isUpdated={isUpdated}
                            setIsUpdated={setIsUpdated}
                        />}

                </div>
            </div>
            {
                Object.keys(user).length > 0 && <Member user={user} isUpdatedCurrentUser={isUpdated} setIsUpdatedCurrentUser={setIsUpdated} />
            }
        </div>

    )
}