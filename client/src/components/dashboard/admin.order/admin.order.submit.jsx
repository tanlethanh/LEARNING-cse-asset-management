import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Alert from '../../alert';
import ConfirmPassword from '../../confirmPassword';
import '../../../styles/waiting.css';

export default function OrderSubmit({ orders, nameList, changeOrders, setChangeOrders, setConfirmPassword }) {

    // utils
    const [typeAlert, setTypeAlert] = useState("")
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [waitingLoad, setWaitingLoad] = useState(false)

    const handleYes = (adminPassword) => {
        orders.map((order, index) => {
            if (order.status !== nameList) {
                let action = ''
                if (order.status === 'ok') action = 'accept'
                else if (order.status === 'denied') action = 'deny'
                else if (order.status === 'done') action = 'confirm'
                setWaitingLoad(true)
                Axios.patch(`/api/order/${order._id}?action=${action}`, {
                    adminPassword: adminPassword
                })
                    .then(response => {
                        setAlertMess("Successfully!")
                        setTypeAlert("success")
                        setAlert(true)
                        setTimeout(() => {
                            setConfirmPassword(false)
                            setChangeOrders(!changeOrders)
                        }, 1000)
                        setWaitingLoad(false)
                    })
                    .catch(error => {

                        if (error.response.status === 403) {
                            setAlertMess("Your password is incorrect!")
                            setTypeAlert("error")
                            setAlert(true)
                            setTimeout(() => { }, 1500)
                        }
                        else if (error.response.status === 400) {
                            if (error.response.data.messages.split(" ")[0] === "E11000") {
                                setAlertMess("Please use another name!")
                            }
                            else {
                                setAlertMess("Failure, bad request!")
                            }
                            setTypeAlert("error")
                            setAlert(true)
                            setTimeout(() => {
                                setConfirmPassword(false)
                            }, 1500)
                        }
                        else {
                            setAlertMess("Failure, please check again!")
                            console.log(error)
                            setTypeAlert("error")
                            setAlert(true)
                            setTimeout(() => {
                                setConfirmPassword(false)
                            }, 1500)
                        }
                    })
            }
        })
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
            {
                waitingLoad && 
                <body className="load">
                    <div className="waiting-load">
                        <span className="fa-solid fa-spinner rotate-around icon"></span>
                    </div>
                </body>
            }
        </React.Fragment>
    )

}