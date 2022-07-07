import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import OrderPDF from '../../orderPDF';
import getFormattedDate from "../../../utils/formatDate"
import ConfirmNext from '../../confirmNext';
import Alert from '../../alert';
import { AppContext } from '../../../App';

export default function Waiting({
    currentList,
    setCurrentList,
    user,
    isUpdatedCurrentUser,
    setIsUpdatedCurrentUser,
}) {

    const { isUpdatedMainUser, setIsUpdatedMainUser, mainUser } = useContext(AppContext)

    const [openConfirmNext, setOpenConfirmNext] = useState(false)
    const [alert, setAlert] = useState(false)
    const [typeAlert, setTypeAlert] = useState("")
    const [alertMess, setAlertMess] = useState('')
    const [idDeleteOrder, setIdDeleteOrder] = useState('')
    const [currentFragment, setCurrentFragment] = useState(0)
    const maxOfFragment = 10
    const numberOfFragment = Math.ceil(currentList.length * 1.0 / maxOfFragment)
    function prevFragment() {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }
    function nextFragment() {
        if (currentFragment < numberOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    const handleBanClick = (orderId) => {
        setOpenConfirmNext(true)
        setIdDeleteOrder(orderId)
    }

    const banPendingOrder = async () => {

        Axios.delete(`http://localhost:8266/api/order/${idDeleteOrder}`, {
        })
            .then(response => {
                setAlertMess("Cancel order successfully!")
                setTypeAlert("success")
                setAlert(true)
                setTimeout(() => {
                    setOpenConfirmNext(false)
                    if (mainUser._id === user._id) setIsUpdatedMainUser(!isUpdatedMainUser)
                    else {
                        setIsUpdatedCurrentUser(!isUpdatedCurrentUser)
                    }
                }, 1000)

            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    setAlertMess("Your password is incorrect!")
                }
                else if (error.response.status === 400) {
                    setAlertMess(error.response.data.messages)
                }
                else {
                    setAlertMess("Cancel order failure, please check again!")
                }

                setTypeAlert("error")
                setAlert(true)
                setTimeout(() => {
                    setOpenConfirmNext(false)
                }, 1000)
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
            {openConfirmNext &&
                <ConfirmNext
                    setOpen={setOpenConfirmNext}
                    callback={banPendingOrder}
                    message={"Are you sure to cancel this order?"}
                />}
            <div className="list-item list-item-title">
                <div className="list-item-col item_name_col">Item</div>
                <div className="list-item-col item_category_col">Category</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Return date</div>
                <div className="list-item-col">Permission</div>
                <div className="list-item-col">Status</div>
            </div>

            {currentList.map((item, index) => (

                index >= currentFragment * maxOfFragment && index < (currentFragment + 1) * maxOfFragment
                &&
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={item._id}>
                    <div className="list-item-col item_name_col">{item.nameItem}</div>
                    <div className="list-item-col item_category_col">{item.categoryItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(item.returnDate))}
                    </div>
                    {item.status === "ok" &&
                        <OrderPDF user={user} order={item} />}
                    {item.status === "ok" &&
                        <div className="list-item-col"><i className="accept_status">Accepted</i></div>}
                    {item.status === "pending" &&
                        <div className="list-item-col">
                            <i
                                className="fa-solid fa-ban pending"
                                onClick={() => {
                                    handleBanClick(item._id)
                                }}
                            ></i>
                        </div>}
                    {item.status === "pending" &&
                        <div className="list-item-col"><i className="pending_status">Pending</i></div>}

                    {item.status === "denied" &&
                        <div className="list-item-col"><i className="fa-solid fa-download"></i></div>}
                    {item.status === "denied" &&
                        <div className="list-item-col"><i className="denied_status">Denied</i></div>}
                </div>
            ))}

            <div className="list-end">
                <div id="previous-number">
                    <button
                        className="move-list"
                        onClick={prevFragment}
                    >Previous</button>
                </div>
                {
                    [...Array(numberOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number" key={index}>
                                <button
                                    className={index === currentFragment ? "chosen" : ""}
                                    onClick={() => {
                                        setCurrentFragment(index)
                                    }}
                                >{index}</button>
                            </div>
                        )
                    })
                }

                <div id="next-number">
                    <button
                        className="move-list"
                        onClick={nextFragment}
                    >Next</button>
                </div>
            </div>
        </div>

    )
}
