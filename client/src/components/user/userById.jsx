import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import ConfirmPassword from '../../helpers/confirmPassword';
import { AppContext } from '../../App';
import User from './user';
import EditUserModal from './editUserModal';
import NotFoundPage from '../../helpers/notFoundPage';
import BlankPage from '../../helpers/blankPage';

export default function UserById({ }) {

    const navigate = useNavigate()

    const { id } = useParams()
    const { data, helpers, mainUser } = useContext(AppContext)
    const [user, setUser] = useState({})
    const [ordersOfUser, setOrdersOfUser] = useState([])
    const [isUpdated, setIsUpdated] = useState(false)

    const [openEditUser, setOpenEditUser] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [confirmPermission, setConfirmPermission] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const dataUser = {
        infor: user,
        setUser: setUser,
        orders: ordersOfUser,
        setOrders: setOrdersOfUser,
    }

    useEffect(() => {
        Axios.get(`/api/user/${id}`)
            .then(response => {
                setUser(response.data.user)
            })
            .catch(error => {
                setNotFound(true)
                helpers.setOpenLoading(false)
            })
    }, [isUpdated])

    useEffect(() => {
        if (Object.keys(user).length === 0 || data.orders.length === 0) return

        const orders = []
        data.orders.map(order => {
            if (user.orders.includes(order._id)) orders.push(order)
        })

        setOrdersOfUser(orders)

    }, [user, data.orders])


    function HandleAdminPermission(adminPassword) {
        helpers.setOpenLoading(true)
        Axios.patch(`/api/user/${user._id}?togglePermission=admin`, {
            adminPassword: adminPassword
        })
            .then(response => {
                helpers.setOpenLoading(false)
                setIsUpdated(!isUpdated)
                helpers.setAlert({
                    type: "success",
                    message: "Toggle permission successfully!"
                })
                helpers.setOpenAlert(true)
                setConfirmPermission(false)
            })
            .catch(error => {
                helpers.setOpenLoading(false)
                if (error.response.status === 403) {
                    setIsUpdated(!isUpdated)
                    helpers.setAlert({
                        type: "error",
                        message: "Wrong password!"
                    })
                    helpers.setOpenAlert(true)
                }
                else {
                    setIsUpdated(!isUpdated)
                    helpers.setAlert({
                        type: "error",
                        message: error.response.data.message
                    })
                    helpers.setOpenAlert(true)
                    setConfirmPermission(false)
                }
            });
    }

    function HandleDelete(adminPassword) {
        helpers.setOpenLoading(true)
        Axios.post(`/api/auth/login`, {
            password: adminPassword,
            email: mainUser.infor.email
        })
            .then(responseConfirmAdmin => {
                Axios.delete(`/api/user/${user._id}`)
                    .then((response) => {
                        helpers.setOpenLoading(false)
                        helpers.setAlert({
                            type: "success",
                            message: "Delete successfully!"
                        })
                        helpers.setOpenAlert(true)
                        navigate("../dashboard")
                    })
                    .catch((error) => {
                        helpers.setOpenLoading(false)
                        helpers.setAlert({
                            type: "error",
                            message: error.response.data.message
                        })
                        helpers.setOpenAlert(true)
                    })

            })
            .catch((error) => {
                helpers.setOpenLoading(false)
                if (error.response.status === 403) {
                    setIsUpdated(!isUpdated)
                    helpers.setAlert({
                        type: "error",
                        message: "Wrong password!"
                    })
                    helpers.setOpenAlert(true)
                }
                else {
                    setIsUpdated(!isUpdated)
                    helpers.setAlert({
                        type: "error",
                        message: error.response.data.message
                    })
                    helpers.setOpenAlert(true)
                    setConfirmPermission(false)
                }
            })
    }

    if (!mainUser.infor.isAdmin || notFound) return <NotFoundPage />
    if (Object.keys(user).length === 0) return <BlankPage />

    return (
        <div className="dashboard_container">
            {confirmPermission && <ConfirmPassword setOpen={setConfirmPermission} callback={HandleAdminPermission} />}
            {confirmDelete && <ConfirmPassword setOpen={setConfirmDelete} callback={HandleDelete} />}
            {openEditUser &&
                <EditUserModal
                    user={user}
                    isUpdated={isUpdated}
                    setIsUpdated={setIsUpdated}
                    setOpenEditUser={setOpenEditUser}
                />}

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
                    <ul className="list-infor">


                        <h3>Information
                            <button
                                className="button-edit"
                                onClick={() => { setOpenEditUser(true) }}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </h3>

                        <li className="item-infor edit-user">
                            Email: {user.email}
                        </li>

                        <li className="item-infor edit-user">
                            Full name: {user.fullName}
                        </li>

                        <li className="item-infor edit-user">
                            Student code: {user.studentCode}
                        </li>

                        <li className="item-infor edit-user">
                            Phone number: {user.phoneNumber}
                        </li>

                        <li className="item-infor edit-user">
                            Password: ********
                        </li>

                        <li className="item-infor edit-user">
                            Permission: {user.isAdmin ? "Admin" : "Member"}
                            <sup className="toggle_admin" onClick={() => { setConfirmPermission(true) }}>toggle</sup>
                        </li>
                        <li className="item-infor delete_user" onClick={() => setConfirmDelete(true)}>
                            Delete this user
                        </li>
                    </ul>

                </div>
            </div>

            <User dataUser={dataUser} />

        </div>

    )
}