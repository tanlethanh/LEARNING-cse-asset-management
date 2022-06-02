import React, { useState, useEffect } from 'react';
import Axios from 'axios'

export default function Users(props) {

    const [users_register, setUsers_register] = useState([])
    const [users_enable, setUsers_enable] = useState([])


    const handleEnableCheck = (index => {
        users_register[index].enable = !users_register[index].enable
        console.log(users_register[index].enable)
    })
    const handleUnEnableCheck = (index => {
        users_enable[index].enable = !users_enable[index].enable
        console.log(users_enable[index].enable)
    })


    // This comment is necessary for handleEnableSubmitButtonClick and useEffect in this component
    // When submit button is clicked, we will call api to update user, 
    // and active setChangeUsers to refresh Users in main dashboard
    // After that users_register and users_enable will be updated
    // because props.users (= Users in main dashboard) will have been updated in previous
    const handleEnableSubmitButtonClick = () => {
        users_register.map((user) => {
            if (user.enable == true) {
                Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`)
                    .then((response) => {
                        console.log(`Enable of ${response.data.user} is ${response.data.user.enable}`)
                    })
            }
        })
        props.setChangeUsers(!props.changeUsers)
    }

    const handleUnEnableSubmitButtonClick = () => {
        users_enable.map((user) => {
            if (user.enable == false) {
                Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`)
                    .then((response) => {
                        console.log(`Enable of ${response.data.user} is ${response.data.user.enable}`)
                    })
            }
        })
        props.setChangeUsers(!props.changeUsers)
    }

    useEffect(() => {
        console.log("hello users")
        setUsers_register(props.users.filter(user => user.enable === false))
        setUsers_enable(props.users.filter(user => user.enable === true))
    }, [props.users])


    // Component of user who is not enable
    function RegUsers(props) {
        return (
            <div>
                <h1>Hello users_register</h1>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />

                </div>
                <div className="list-item list-item-title">
                    <div className="list-item-col user_email_col">Email</div>
                    <div className="list-item-col user_name_col">Full Name</div>
                    <div className="list-item-col user_code_col">Student Code</div>
                    <div className="list-item-col user_phone_col">Phone Number</div>
                    <div className="list-item-col">Set Enable</div>
                </div>
                {
                    props.users.map((user, index) => {
                        return (
                            <div key={user._id} className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                                <div className="list-item-col user_email_col">{user.email}</div>
                                <div className="list-item-col user_name_col">{user.fullName}</div>
                                <div className="list-item-col user_code_col">{user.studentCode}</div>
                                <div className="list-item-col user_phone_col">{user.phoneNumber}</div>
                                <div className="list-item-col">
                                    <input type="checkbox" onChange={() => { handleEnableCheck(index) }} />
                                </div>
                            </div>
                        )
                    })
                }
                <div className="user_enable_submit">
                    <button
                        type="submit"
                        className="user_enable_submit_button"
                        onClick={handleEnableSubmitButtonClick}
                    >
                        Enable checked users
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
    // Component of user who is enable
    function EnableUsers(props) {
        return (
            <div>
                <h1>Hello users_register</h1>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />

                </div>

                <div className="list-item list-item-title">
                    <div className="list-item-col user_email_col">Email</div>
                    <div className="list-item-col user_name_col">Full Name</div>
                    <div className="list-item-col user_code_col">Student Code</div>
                    <div className="list-item-col user_phone_col">Phone Number</div>
                    <div className="list-item-col">Unenable</div>
                </div>


                {
                    props.users.map((user, index) => {
                        return (
                            <div key={user._id} className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                                <div className="list-item-col user_email_col">{user.email}</div>
                                <div className="list-item-col user_name_col">
                                    {user.fullName}
                                    {user.isAdmin && <sup className="isAdmin">admin</sup>}
                                </div>
                                <div className="list-item-col user_code_col">{user.studentCode}</div>
                                <div className="list-item-col user_phone_col">{user.phoneNumber}</div>
                                <div className="list-item-col">
                                    <input type="checkbox" onChange={() => { handleUnEnableCheck(index) }} />
                                </div>
                            </div>
                        )
                    })
                }

                <div className="user_enable_submit">
                    <button
                        type="submit"
                        className="user_enable_submit_button"
                        onClick={handleUnEnableSubmitButtonClick}
                    >
                        Unenable checked users
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
                    <RegUsers users={users_register} /> :
                    <EnableUsers users={users_enable} />
            }
        </div>
    )
}