import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders({ orders, items, users, nameList, setChangeOrders, changeOrders }) {
    // orders are list of order which all has the same status (nameList)
    // nameList is type of chosen list in menu bar, its equal to status of any order in 'orders'
    const [change, setChange] = useState(false)
    const navigate = useNavigate()

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
    }

    const handleClickItem = (idItem) => {
        items.forEach(item => {
            if (item._id === idItem) {
                return navigate("../item/detail/" + item._id, { state: { item: item } })
            }
        })

    }

    const handleClickUser = (idUser) => {
        users.forEach(user => {
            if (user._id === idUser) {
                return navigate("../user/detail/" + user._id, { state: { user: user } })
            }
        })
    }


    if (orders[nameList].length === 0) {
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
                        <div key={order._id} className={"list-item " + (index % 2 === 0 && "list-item-odd")}>

                            <div
                                className="list-item-col order_name_item"
                                onClick={() => {
                                    handleClickItem(order.idItem)
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
                                    handleClickUser(order.idUser)
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
            <div className="order_submit">
                <button
                    type="submit"
                    className="order_submit_button"
                    onClick={handleSubmit}
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