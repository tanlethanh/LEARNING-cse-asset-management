import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../alert';

export default function Orders({ orders, items, users, nameList, setChangeOrders, changeOrders }) {
    // orders are list of order which all has the same status (nameList)
    // nameList is type of chosen list in menu bar, its equal to status of any order in 'orders'
    const [change, setChange] = useState(false)
    const navigate = useNavigate()

    const [successEnable, setSuccessEnable] = useState(false)

    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')

    // use for fragment
    const maxLengthOfFragment = 8
    const numOfFragment = Math.ceil(orders[nameList].length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFracment] = useState(0)

    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFracment(currentFragment - 1)
    }

    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFracment(currentFragment + 1)
    }


    useEffect(() => { }, [orders])

    const handleButton = (index, nextStatus) => {
        if (orders[nameList][index].status !== nextStatus) {
            orders[nameList][index].status = nextStatus
        }
        else {
            orders[nameList][index].status = nameList
        }
        setChange(!change)
    }

    const handleSubmit = () => {
        orders[nameList].map(order => {
            if (order.status !== nameList) {
                let action = ''
                if (order.status === 'ok') action = 'accept'
                else if (order.status === 'denied') action = 'deny'
                else if (order.status === 'done') action = 'confirm'
                Axios.patch(`http://localhost:8266/api/order/${order._id}?action=${action}`)
                    .then(response => {
                        setChangeOrders(!changeOrders)
                    })
            }
        })
        setSuccessEnable(true)
    }

    const openItemDetail = (idItem) => {
        items.forEach(item => {
            if (item._id === idItem) {
                return navigate("../item/detail/" + item._id, { state: { item: item, orders: orders, users: users } })
            }
        })

    }

    const openUserDetail = (idUser) => {
        users.forEach(user => {
            if (user._id === idUser) {
                return navigate("../user/detail/" + user._id, { state: { user: user } })
            }
        })
    }


    // success alert
    function SuccessEnable() {
        setAlertMess("Success!")
        setAlert(false)
        setAlert(true)
        setTimeout(function () {
            setSuccessEnable(false)
        }, 1000)

        return (
            <Alert
                type="success"
                message={alertMess}
                alert={alert}
                setAlert={setAlert}
            />
        )
    }

    if (orders[nameList].length === 0) {
        return (
            <div>
                <h1 className='no_content'>Empty list!</h1>
                {successEnable && <SuccessEnable />}
            </div>
        )
    } else {
        return (
            <div>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>
                <div className="list-item-title">
                    <div className="list-item-col order_name_item">Name of item</div>
                    <div className="list-item-col order_quantity">Quantity</div>
                    <div className="list-item-col order_return_date">Return date</div>
                    <div className="list-item-col order_name_user">Borrower</div>
                    <div className="list-item-col">
                        {nameList === 'pending' && "Accept/Deny"}
                        {nameList === 'ok' && "Confirm complete"}
                        {nameList === 'complete' && "Type of order"}
                    </div>
                </div>
                {
                    orders[nameList].map((order, index) => {
                        return (
                            (index >= currentFragment * maxLengthOfFragment
                                && index < (currentFragment + 1) * maxLengthOfFragment)
                            && <div key={order._id} className={"list-item " + (index % 2 === 0 && "list-item-odd")}>

                                <div
                                    className="list-item-col order_name_item"
                                    onClick={() => {
                                        openItemDetail(order.idItem)
                                    }}
                                >
                                    {order.nameItem}
                                </div>

                                <div className="list-item-col order_quantity">{order.quantity}</div>
                                <div className="list-item-col order_return_date">
                                    {order.returnDate.substring(0, order.returnDate.indexOf('T'))}
                                </div>

                                <div
                                    className="list-item-col order_name_user"
                                    onClick={() => {
                                        openUserDetail(order.idUser)
                                    }}
                                >
                                    {order.nameUser}
                                </div>

                                <div className="list-item-col">
                                    {
                                        nameList === 'pending' &&
                                        <div>
                                            <button
                                                className={"order_accept_button " + (order.status === 'ok' ? "chosen" : "")}
                                                onClick={() => { handleButton(index, 'ok') }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className={"order_deny_button " + (order.status === 'denied' ? "chosen" : "")}
                                                onClick={() => { handleButton(index, 'denied') }}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    }
                                    {
                                        nameList === 'ok' &&
                                        <input type="checkbox" onChange={() => { handleButton(index, 'done') }} />
                                    }
                                    {
                                        nameList === 'complete' &&
                                        <div className=
                                            {order.status === 'denied' ? 'denied_status' : 'accept_status'}

                                        >{order.status}</div>
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
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    {successEnable && <SuccessEnable />}
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
}