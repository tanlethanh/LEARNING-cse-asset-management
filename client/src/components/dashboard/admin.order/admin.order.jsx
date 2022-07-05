import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSubmit from './admin.order.submit';
import getFormattedDate from '../../../utils/formatDate';
import Arrange, { arrangeList } from '../../arrange';
import reverseName from '../../../utils/reverseName';

export default function Orders({ orders, items, users, nameList, setChangeOrders, changeOrders }) {
    // orders are list of order which all has the same status (nameList)
    // nameList is type of chosen list in menu bar, its equal to status of any order in 'orders'
    const [change, setChange] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })
    const [ordersRender, setOrdersRender] = useState([])
    const navigate = useNavigate()

    // use for fragment
    const maxLengthOfFragment = 8
    const numOfFragment = Math.ceil(orders[nameList].length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)
    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }
    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    useEffect(() => {
        let type = "string"
        if (arrangeKey.column === "updatedAt" || arrangeKey.column === "returnDate") type = "date"
        else if (arrangeKey.column === "nameUser") type = "name"
        if (query === "") {
            setOrdersRender(arrangeList(orders[nameList], arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setOrdersRender(
                arrangeList(
                    orders[nameList].filter((order) =>
                        order.nameItem.toLowerCase().includes(query.toLowerCase())
                        || order.nameUser.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.updatedAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.returnDate)).includes(query.toLowerCase())
                    ),
                    arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [orders, query, arrangeKey, nameList])

    const handleButton = (index, nextStatus) => {
        if (ordersRender[index].status !== nextStatus) {
            ordersRender[index].status = nextStatus
        }
        else {
            ordersRender[index].status = nameList
        }
        setChange(!change)
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


    if (ordersRender.length === 0) {
        return (
            <div>
                <h1 className='no_content'>Empty list!</h1>
            </div>
        )
    } else {
        return (
            <div>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => { setQuery(e.target.value) }}
                    />
                </div>
                <div className="list-item-title">
                    <div className="list-item-col order_name_item">
                        Name of item
                        <Arrange type="nameItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col order_quantity">Quantity</div>
                    <div className="list-item-col order_updated_date">
                        {nameList === 'pending' && "Innitiated date"}
                        {nameList === 'ok' && "Approved date"}
                        {nameList === 'complete' && "Confirmation date"}
                        <Arrange type="updatedAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col order_return_date">
                        Return date
                        <Arrange type="returnDate" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col order_name_user">
                        Borrower
                        <Arrange type="nameUser" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col">
                        {nameList === 'pending' && "Accept or denied"}
                        {nameList === 'ok' && "Confirm return"}
                        {nameList === 'complete' && "Status"}
                    </div>
                </div>
                {
                    ordersRender.map((order, index) => {
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
                                <div className="list-item-col order_updated_date">
                                    {nameList === 'pending' && getFormattedDate(new Date(order.updatedAt))}
                                    {nameList === 'ok' && getFormattedDate(new Date(order.updatedAt))}
                                    {nameList === 'complete' && getFormattedDate(new Date(order.updatedAt))}
                                </div>
                                <div className="list-item-col order_return_date">
                                    {getFormattedDate(new Date(order.returnDate))}
                                </div>

                                <div
                                    className="list-item-col order_name_user"
                                    onClick={() => {
                                        openUserDetail(order.idUser)
                                    }}
                                >
                                    {reverseName(order.nameUser)}
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
                                        <input
                                            type="checkbox"
                                            onChange={() => { handleButton(index, 'done') }}
                                            defaultChecked={order.status === 'done'}
                                        />
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
                        onClick={() => { setConfirmPassword(true) }}
                    >
                        Submit
                    </button>
                    {confirmPassword &&
                        <OrderSubmit
                            orders={ordersRender}
                            nameList={nameList}
                            changeOrders={changeOrders}
                            setChangeOrders={setChangeOrders}
                            setConfirmPassword={setConfirmPassword}
                        />}
                </div>
                <div className="list-end">
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
                </div>
            </div>

        )
    }
}