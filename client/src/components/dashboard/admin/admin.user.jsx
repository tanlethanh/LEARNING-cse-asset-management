import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Alert from '../../alert';

export default function Users(props) {

    const navigate = useNavigate()
    const [users_register, setUsers_register] = useState([])
    const [users_enable, setUsers_enable] = useState([])

    const [successEnable, setSuccessEnable] = useState(false)

    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    useEffect(() => {
        setUsers_register(props.users.filter(user => user.enable === false))
        setUsers_enable(props.users.filter(user => user.enable === true))
    }, [props.users])

    const handleChecked = ((index, usersType) => {
        if (usersType === 'register') {
            users_register[index].enable = !users_register[index].enable
        }
        else if (usersType === 'enable') {
            users_enable[index].enable = !users_enable[index].enable
        }

    })

    // This comment is necessary for handleEnableSubmitButtonClick and useEffect in this component
    // When submit button is clicked, we will call api to update user, 
    // and active setChangeUsers to refresh Users in main dashboard
    // After that users_register and users_enable will be updated
    // because props.users (= Users in main dashboard) will have been updated in previous
    const handleSubmit = (usersType) => {
        if (usersType === 'register') {
            users_register.map((user) => {
                if (user.enable === true) {
                    Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`)
                        .then((response) => {
                            props.setChangeUsers(!props.changeUsers)
                        })
                }
            })

        }
        else if (usersType === 'enable') {
            users_enable.map((user) => {
                if (user.enable === false) {
                    Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`)
                        .then((response) => {
                            props.setChangeUsers(!props.changeUsers)
                        })
                }
            })

        }
        setSuccessEnable(true)
    }

    const openUserDetail = (user) => {
        navigate("../user/detail/" + user._id, { state: { user: user } })
    }
    
    // success alert
    function SuccessEnable() {
        setAlertMess("Success!")
        setAlert(false)
        setAlert(true)
        setTimeout(function () {
            setSuccessEnable(false)
        }, 1000)
        
        return(
            <Alert
                type="success"
                message={alertMess}
                alert={alert}
                setAlert={setAlert}
            />
        )
    }

    // Component of user who is not enable
    function UsersRender(props) {

        if (props.users.length === 0) {
            return (
                <h1 className='no_content'>Empty list!</h1>
            )
        }

        return (
            <div>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>
                <div className="list-item-title">
                    <div className="list-item-col user_email_col">Email</div>
                    <div className="list-item-col user_name_col">Full Name</div>
                    <div className="list-item-col user_code_col">Student Code</div>
                    <div className="list-item-col user_phone_col">Phone Number</div>
                    <div className="list-item-col">{props.type === 'register' ? "Set Enable" : "Unenable"}</div>
                </div>
                {
                    props.users.map((user, index) => {
                        return (
                            <div

                                key={user._id}
                                className={"list-item " + (index % 2 === 0 && "list-item-odd")}
                            >
                                <div className="list-item-col user_email_col">{user.email}</div>
                                <div
                                    className="list-item-col user_name_col"
                                    onClick={() => openUserDetail(user)}
                                >
                                    {user.fullName}
                                    {props.type === 'enable' && user.isAdmin && <sup className="isAdmin">admin</sup>}
                                </div>
                                <div className="list-item-col user_code_col">{user.studentCode}</div>
                                <div className="list-item-col user_phone_col">{user.phoneNumber}</div>
                                <div className="list-item-col">
                                    <input type="checkbox" onChange={() => { handleChecked(index, props.type) }} />
                                </div>
                            </div>
                        )
                    })
                }
                <div className="submit_button_container">
                    <button
                        type="submit"
                        className="submit_button"
                        onClick={() => { handleSubmit(props.type) }}
                    >
                        Submit
                    </button>
                </div>
                <div className="list-end">
                    <div id="previous-number"><button className="move-list">Previous</button></div>
                    <div className="list-number"><button className="chosen">1</button></div>
                    <div className="list-number"><button>2</button></div>
                    <div className="list-number"><button>3</button></div>
                    <div id="next-number"><button className="move-list">Next</button></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {
                props.nameList === "users_register" ?
                    <UsersRender users={users_register} type='register' /> :
                    <UsersRender users={users_enable} type='enable' />
            }
            {successEnable && <SuccessEnable />}
        </div>
    )
}