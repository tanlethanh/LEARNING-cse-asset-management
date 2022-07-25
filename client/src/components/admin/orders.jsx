import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import getFormattedDate from '../../utils/formatDate';
import Arrange, { arrangeList } from '../../helpers/arrange';
import reverseName from '../../utils/reverseName';
import { AppContext } from '../../App'
import ConfirmPassword from '../../helpers/confirmPassword';
import Axios from 'axios'

export default function Orders({ status }) {

    const { data, helpers } = useContext(AppContext)
    const [currentData, setCurrentData] = useState([])
    const [ordersRender, setOrdersRender] = useState([])
    const navigate = useNavigate()

    const [rerender, setRerender] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)

    // for search
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })

    // use for fragment
    const maxLengthOfFragment = 8
    const numOfFragment = Math.ceil(currentData.length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)
    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }
    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }


    const handleButton = (index, nextStatus) => {
        if (!ordersRender[index].nextStatus) {
            ordersRender[index].nextStatus = nextStatus
        }
        else {
            ordersRender[index].nextStatus = null
        }
        if (status === "pending") {
            setRerender(!rerender)
        }
    }

    const openItemDetail = (id) => {
        return navigate("../item/" + id)

    }

    const openUserDetail = (id) => {
        return navigate("../user/" + id)
    }

    const handleYes = (adminPassword) => {

        const changeStatusOrders = ordersRender.filter(order => order.nextStatus)
        let hasError = false

        helpers.setOpenLoading(true)
        changeStatusOrders.map((order, index) => {
            if (!hasError) {

                let action = ''
                if (order.nextStatus === 'ok') action = 'accept'
                else if (order.nextStatus === 'denied') action = 'deny'
                else if (order.nextStatus === 'done') action = 'confirm'


                Axios.patch(`/api/order/${order._id}?action=${action}`, {
                    adminPassword: adminPassword
                })
                    .then(response => {
                        order.status = order.nextStatus
                        order.nextStatus = null
                        helpers.setAlert({
                            type: "success",
                            message: response.data.message
                        })
                        helpers.setOpenAlert(true)

                        if (index === changeStatusOrders.length - 1) {
                            helpers.setOpenLoading(false)
                            data.setOrders([...data.orders])
                            setConfirmPassword(false)
                        }

                    })
                    .catch(error => {
                        // if has error in element which has index larger than 0, we need to updated orders
                        if (index > 0) {
                            data.setOrders([...data.orders])
                            setConfirmPassword(false)
                        }

                        helpers.setOpenLoading(false)

                        helpers.setAlert({
                            type: "error",
                            message: error.response.data.message
                        })
                        helpers.setOpenAlert(true)

                        hasError = true
                    })
            }
        })
    }


    // set list by status 
    useEffect(() => {
        if (status === "pending") {
            setCurrentData(data.orders.filter(order => order.status === "pending"))
        }
        else if (status === "accepted") {
            setCurrentData(data.orders.filter(order => order.status === "ok"))
        }
        else if (status === "complete") {
            setCurrentData(data.orders.filter(order => order.status === "done" || order.status === "denied"))
        }
    }, [data.orders])

    // set render list by query and arrange
    useEffect(() => {
        let type = "string"
        if (arrangeKey.column === "updatedAt" || arrangeKey.column === "returnDate") type = "date"
        else if (arrangeKey.column === "nameUser") type = "name"
        if (query === "") {
            setOrdersRender(arrangeList(currentData, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setOrdersRender(
                arrangeList(
                    currentData.filter((order) =>
                        order.nameItem.toLowerCase().includes(query.toLowerCase())
                        || order.nameUser.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.updatedAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.returnDate)).includes(query.toLowerCase())
                    ),
                    arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [currentData, query, arrangeKey])

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
                    onChange={(e) => { setQuery(e.target.value) }}
                />
            </div>
            <p className='dashboard_guide'>
                Node: You can click on name of item or user to see and edit the detail of item or user
            </p>

            <div className="list-item list-item-title">
                <div className="list-item-col order_name_item">
                    Name of item
                    <Arrange type="nameItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col order_quantity">Quantity</div>
                <div className="list-item-col order_updated_date">
                    {status === 'pending' && "Innitiated date"}
                    {status === 'accepted' && "Approved date"}
                    {status === 'complete' && "Confirmation date"}
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
                    {status === 'pending' && "Accept/Deny"}
                    {status === 'accepted' && "Confirm return"}
                    {status === 'complete' && "Status"}
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
                            <div className="list-item-col order_updated_date ">
                                {status === 'pending' && getFormattedDate(new Date(order.updatedAt))}
                                {status === 'accepted' && getFormattedDate(new Date(order.updatedAt))}
                                {status === 'complete' && getFormattedDate(new Date(order.updatedAt))}
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
                                    status === 'pending' &&
                                    <div>
                                        <button
                                            className={"order_accept_button " + (order.nextStatus === 'ok' ? "chosen" : "")}
                                            onClick={() => { handleButton(index, 'ok') }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className={"order_deny_button " + (order.nextStatus === 'denied' ? "chosen" : "")}
                                            onClick={() => { handleButton(index, 'denied') }}
                                        >
                                            Deny
                                        </button>
                                    </div>
                                }
                                {
                                    status === 'accepted' &&
                                    <input
                                        type="checkbox"
                                        onChange={() => { handleButton(index, 'done') }}
                                        defaultChecked={order.status === 'done'}
                                    />
                                }
                                {
                                    status === 'complete' &&
                                    <div className=
                                        {order.status === 'denied' ? 'denied_status' : 'accept_status'}
                                    >{order.status}</div>
                                }

                            </div>
                        </div>
                    )
                })
            }
            {ordersRender.length > 0 && <div className="submit_button_container">
                <button
                    type="submit"
                    className="submit_button"
                    onClick={() => { setConfirmPassword(true) }}
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