import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import ConfirmPassword from '../../helpers/confirmPassword';
import Arrange, { arrangeList } from '../../helpers/arrange';
import getFormattedDate from '../../utils/formatDate';
import reverseName from '../../utils/reverseName';
import { AppContext } from '../../App';

export default function Users({ enable }) {

    const { data, helpers, mainUser } = useContext(AppContext)
    const [usersRender, setUsersRender] = useState([])
    const navigate = useNavigate()

    // utils
    const [confirmPassword, setConfirmPassword] = useState(false)
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })

    // use for fragment
    const maxLengthOfFragment = 10
    const numOfFragment = Math.ceil(data.users.filter(user => user.enable === enable).length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)
    function prevFragment() {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }
    function nextFragment() {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    // handle when onclick checkbox
    const handleChecked = (index) => {
        if (usersRender[index].doesToggle) {
            usersRender[index].doesToggle = !usersRender[index].doesToggle
        }
        else {
            usersRender[index].doesToggle = true
        }
    }

    // onClickSubmitButton
    const onClickSubmitButton = () => {
        if (usersRender.filter(user => user.doesToggle === true).length === 0) {
            helpers.setAlert({
                type: "warning",
                message: "Nothing to submit"
            })
            helpers.setOpenAlert(true)
        }
        else {
            setConfirmPassword(true)
        }
    }

    // callback after confirm password
    const handleYes = (adminPassword) => {
        const submitUsers = usersRender.filter(user => user.doesToggle === true)
        helpers.setOpenLoading(true)

        let hasError = false
        submitUsers.map((user, index) => {
            if (!hasError) {
                Axios.patch(`/api/user/${user._id}?togglePermission=enable`, {
                    adminPassword: adminPassword
                })
                    .then((response) => {

                        user.enable = !user.enable
                        user.doesToggle = false

                        if (index === submitUsers.length - 1) {
                            data.setUsers([...data.users])
                            helpers.setOpenLoading(false)

                            helpers.setAlert({
                                type: "success",
                                message: "Set enable successfully!"
                            })

                            helpers.setOpenAlert(true)

                            setConfirmPassword(false)
                        }
                    })
                    .catch(error => {
                        helpers.setOpenLoading(false)
                        hasError = true
                        const alert = {
                            type: "error",
                            message: ""
                        }
                        if (error.response.status === 403) {
                            alert.message = "Your password is incorrect!"
                        }
                        else {
                            alert.message = error.response.data.message
                            setConfirmPassword(false)
                        }

                        if (index > 0) {
                            data.setUsers([...data.users])
                        }

                        helpers.setAlert(alert)
                        helpers.setOpenAlert(true)
                    })
            }

        })
    }

    function openUserDetail(user) {
        navigate("../user/" + user._id)
    }

    useEffect(() => {
        let type = "string"
        if (arrangeKey.column === "updatedAt") {
            type = "date"
        }
        else if (arrangeKey.column === "fullName") {
            type = "name"
        }

        if (query === "") {
            setUsersRender(arrangeList(
                data.users.filter(user => user.enable === enable),
                arrangeKey.column, type, arrangeKey.arrange
            ))
        }
        else {
            setUsersRender(
                arrangeList(
                    data.users.filter(user => user.enable === enable && (
                        user.fullName.toLowerCase().includes(query.toLowerCase())
                        || user.email.toLowerCase().includes(query.toLowerCase())
                        || user.studentCode.toLowerCase().includes(query.toLowerCase())
                        || user.phoneNumber.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(user.updatedAt)).includes(query.toLowerCase()))
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [data.users, query, arrangeKey])

    return (
        <div>
            {
                confirmPassword &&
                <ConfirmPassword
                    setOpen={setConfirmPassword}
                    callback={handleYes}
                />
            }
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="Search..."
                    autoComplete='off'
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>
            <p className='dashboard_guide'>
                Node: You can click on name of user to see and edit the detail of user
            </p>

            <div className="list-item list-item-title">
                <div className="list-item-col user_email_col">
                    Email
                    <Arrange type="email" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_name_col">
                    Full Name
                    <Arrange type="fullName" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_code_col">
                    Student Code
                    <Arrange type="studentCode" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_phone_col">
                    Phone Number
                </div>
                <div className="list-item-col user_updatedAt_col">
                    Update at
                    <Arrange type="updatedAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col">
                    {enable === false ? "Set Enable" : "Unenable"}
                </div>
            </div>
            {
                usersRender.map((user, index) => {
                    return (
                        (index >= currentFragment * maxLengthOfFragment
                            && index < (currentFragment + 1) * maxLengthOfFragment)
                        &&
                        <div
                            key={user._id}
                            className={
                                "list-item " +
                                ((mainUser.infor._id === user._id && "list-item-you")
                                    || (index % 2 === 0 && "list-item-odd"))
                            }
                        >
                            <div className="list-item-col user_email_col">{user.email}</div>
                            <div
                                className="list-item-col user_name_col"
                                onClick={() => openUserDetail(user)}
                            >
                                {reverseName(user.fullName)}
                                {user.enable && user.isAdmin && <sup className="isAdmin">admin</sup>}
                            </div>
                            <div className="list-item-col user_code_col">{user.studentCode}</div>
                            <div className="list-item-col user_phone_col">{user.phoneNumber}</div>
                            <div className="list-item-col user_updatedAt_col">{
                                getFormattedDate(new Date(user.updatedAt))
                            }</div>
                            <div className="list-item-col">
                                {
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            handleChecked(index)
                                        }}
                                        defaultChecked={user.doesToggle === true}
                                    />
                                }
                            </div>
                        </div>
                    )
                })
            }
            {usersRender.length > 0 && <div className="submit_button_container">
                <button
                    type="submit"
                    className="submit_button"
                    onClick={onClickSubmitButton}
                >
                    Submit
                </button>

            </div>}
            {numOfFragment > 1 && <div className="list-end">
                <div id="previous-number">
                    <button className="move-list" onClick={prevFragment}>Previous</button>
                </div>
                {
                    [...Array(numOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number " key={index}>
                                <button
                                    className={(currentFragment === index ? "chosen" : "")}
                                    onClick={() => {
                                        setCurrentFragment(index)
                                    }}
                                >{index}</button>
                            </div>
                        )
                    })
                }
                <div id="next-number">
                    <button className="move-list" onClick={nextFragment}>Next</button>
                </div>
            </div>}
        </div>
    )

}