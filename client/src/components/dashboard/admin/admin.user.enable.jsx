import React, { useState } from 'react';
import Axios from 'axios'
import Alert from '../../alert';
import ConfirmPassword from '../../confirmPassword';

// This comment is necessary for handleEnableSubmitButtonClick and useEffect in this component
// When submit button is clicked, we will call api to update user, 
// and active setChangeUsers to refresh Users in main dashboard
// After that users_register and users_enable will be updated
// because props.users (= Users in main dashboard) will have been updated in previous

export default function AcceptEnable({ usersType, users_register, users_enable, changeUsers, setChangeUsers, setConfirmPassword }) {
    // utils
    const [typeAlert, setTypeAlert] = useState("")
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
        
    const handleYes = (adminPassword) =>{
        if (usersType === 'register') {
            users_register.map((user, index) => {
                console.log(user)
                if (user.enable === true) {
                    Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`, {
                        adminPassword: adminPassword
                    })
                    .then((response) => {
                        if (index === users_register.length - 1) {
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
                }
            })

        }
        else if (usersType === 'enable') {
            users_enable.map((user, index) => {
                if (user.enable === false) {
                    Axios.patch(`http://localhost:8266/api/user/${user._id}?togglePermission=enable`,{
                        adminPassword: adminPassword
                    })
                    .then((response) => {
                        if (index === users_enable.length - 1) {
                            setAlertMess("Set unenable successfully!")
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
                }
            })

        }

    }

    return (
        <React.Fragment>
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
                    setOpen={setConfirmPassword}
                    callback={handleYes}
                />
            }
        </React.Fragment>
    )
}