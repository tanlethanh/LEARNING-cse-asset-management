import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import ConfirmPassword from '../../confirmPassword';
import Alert from '../../alert';

export default function Users({ users, enable, changeUsers, setChangeUsers }) {
    const navigate = useNavigate()
    const [confirmPassword, setConfirmPassword] = useState(false)
    // utils
    const [typeAlert, setTypeAlert] = useState("")
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    // use for fragment
    const maxLengthOfFragment = 10
    const numOfFragment = Math.ceil(users.filter(user => user.enable === enable).length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFracment] = useState(0)
    function prevFragment() {
        if (currentFragment > 0) setCurrentFracment(currentFragment - 1)
    }

    function nextFragment() {
        if (currentFragment < numOfFragment - 1) setCurrentFracment(currentFragment + 1)
    }


    // handle when onclick checkbox
    function handleChecked(studentCode) {
        const indexUser = users.findIndex(user => user.studentCode === studentCode)
        if (users[indexUser].doesToggle) {
            users[indexUser].doesToggle = !users[indexUser].doesToggle
        }
        else {
            users[indexUser].doesToggle = true
        }
    }

    // callback after confirm password
    const handleYes = (adminPassword) => {
        const submitUsers = users.filter(user => user.enable === enable && user.doesToggle === true)
        submitUsers.map((user, index) => {
            Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`, {
                adminPassword: adminPassword
            })
                .then((response) => {
                    if (index === submitUsers.length - 1) {
                        setAlertMess("Set enable successfully!")
                        setTypeAlert("success")
                        setAlert(true)
                        setTimeout(() => {
                            setConfirmPassword(false)
                            setChangeUsers(!changeUsers)
                        }, 500)
                    }
                })
                .catch(error => {

                    if (error.response.status === 403) {
                        setAlertMess("Your password is incorrect!")
                    }
                    else if (error.response.status === 400) {
                        if (error.response.data.messages.split(" ")[0] === "E11000") {
                            setAlertMess("Please use another name!")
                        }
                        else {
                            setAlertMess("Add new item failure, bad request!")
                        }
                    }
                    else {
                        setAlertMess("Add new item failure, please check again!")
                    }

                    console.log(error)
                    setTypeAlert("error")
                    setAlert(true)
                    setTimeout(() => {
                        setConfirmPassword(false)
                        setChangeUsers(!changeUsers)
                    }, 500)
                })

        })
    }

    function openUserDetail(user) {
        navigate("../user/detail/" + user._id, { state: { user: user } })
    }




    // render

    if (users.filter(user => user.enable === enable).length === 0) {
        return (
            <h1 className='no_content'>Empty list!</h1>
        )
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
                confirmPassword &&
                <ConfirmPassword
                    setOpen={setConfirmPassword}
                    callback={handleYes}
                />
            }
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search item" />
            </div>
            <div className="list-item-title">
                <div className="list-item-col user_email_col">Email</div>
                <div className="list-item-col user_name_col">Full Name</div>
                <div className="list-item-col user_code_col">Student Code</div>
                <div className="list-item-col user_phone_col">Phone Number</div>
                <div className="list-item-col">{enable === false ? "Set Enable" : "Unenable"}</div>
            </div>
            {
                users.filter(user => user.enable === enable).map((user, index) => {
                    return (
                        (index >= currentFragment * maxLengthOfFragment
                            && index < (currentFragment + 1) * maxLengthOfFragment)
                        &&
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
                                {user.enable && user.isAdmin && <sup className="isAdmin">admin</sup>}
                            </div>
                            <div className="list-item-col user_code_col">{user.studentCode}</div>
                            <div className="list-item-col user_phone_col">{user.phoneNumber}</div>
                            <div className="list-item-col">
                                {
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            handleChecked(user.studentCode)
                                        }}
                                        defaultChecked={user.doesToggle === true}
                                    />
                                }
                            </div>
                        </div>
                    )
                })
            }
            <div className="submit_button_container">
                <button
                    type="submit"
                    className="submit_button"
                    onClick={() => { setConfirmPassword(true) }}
                >
                    Submit
                </button>

            </div>
            <div className="list-end">
                <div id="previous-number">
                    <button className="move-list" onClick={prevFragment}>Previous</button>
                </div>
                {
                    [...Array(numOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number ">
                                <button
                                    className={(currentFragment === index ? "chosen" : "")}
                                    onClick={() => {
                                        setCurrentFracment(index)
                                    }}
                                >{index}</button>
                            </div>
                        )
                    })
                }
                <div id="next-number">
                    <button className="move-list" onClick={nextFragment}>Next</button>
                </div>
            </div>
        </div>
    )

}