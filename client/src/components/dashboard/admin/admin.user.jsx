import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AcceptEnable from './admin.user.enable';

export default function Users(props) {

    const navigate = useNavigate()
    const [users_register, setUsers_register] = useState([])
    const [users_enable, setUsers_enable] = useState([])
    const [confirmPassword, setConfirmPassword] = useState(false)

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

    const openUserDetail = (user) => {
        navigate("../user/detail/" + user._id, { state: { user: user } })
    }

    // Component of user who is not enable
    function UsersRender(props) {

        // use for fragment
        const maxLengthOfFragment = 10
        const numOfFragment = Math.ceil(props.users.length * 1.0 / maxLengthOfFragment)
        const [currentFragment, setCurrentFracment] = useState(0)

        const prevFragment = () => {
            if (currentFragment > 0) setCurrentFracment(currentFragment - 1)
        }

        const nextFragment = () => {
            if (currentFragment < numOfFragment - 1) setCurrentFracment(currentFragment + 1)
        }

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
                            (index >= currentFragment * maxLengthOfFragment
                                && index < (currentFragment + 1) * maxLengthOfFragment)
                            && <div

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
                        onClick={() => { setConfirmPassword(true) }}
                    >
                        Submit
                    </button>
                    {confirmPassword && 
                    <AcceptEnable 
                        usersType={props.type} 
                        users_register={users_register}
                        users_enable={users_enable}
                        changeUsers={props.changeUsers}
                        setChangeUsers={props.setChangeUsers}
                        setConfirmPassword={setConfirmPassword}/>}
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

    return (
        <div>
            {
                props.nameList === "users_register" ?
                    <UsersRender users={users_register} type='register' changeUsers={props.changeUsers} setChangeUsers={props.setChangeUsers}/> :
                    <UsersRender users={users_enable} type='enable' changeUsers={props.changeUsers} setChangeUsers={props.setChangeUsers}/>
            }
        </div>
    )
}