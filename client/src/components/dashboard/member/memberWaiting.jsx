import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import OrderPDF from '../../orderPDF';
import getFormattedDate from "../../../utils/formatDate"
import ConfirmNext from '../../confirmNext';
import Alert from '../../alert';
import { AppContext } from '../../../App';
import Arrange, { arrangeList } from '../../arrange';

export default function Waiting({
    currentList,
    setCurrentList,
    user,
    isUpdatedCurrentUser,
    setIsUpdatedCurrentUser,
}) {
    const { isUpdatedMainUser, setIsUpdatedMainUser, mainUser } = useContext(AppContext)
    const [ordersRender, setOrdersRender] = useState(currentList)
    const [openConfirmNext, setOpenConfirmNext] = useState(false)
    const [idDeleteOrder, setIdDeleteOrder] = useState('')

    // for search and arrange
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "createdAt",
        arrange: "dec"
    })

    useEffect(() => {

        let type = "string"
        if (arrangeKey.column === "createdAt" || arrangeKey.column === "returnDate") {
            type = "date"
        }
        else if (arrangeKey.column === "quantity") {
            type = "number"
        }

        if (query === "") {
            setOrdersRender(arrangeList(currentList, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setOrdersRender(
                arrangeList(
                    currentList.filter(order =>
                        order.nameItem.toLowerCase().includes(query.toLowerCase())
                        || order.categoryItem.toLowerCase().includes(query.toLowerCase())
                        || order.status.toLowerCase().includes(query.toLowerCase())
                        || order.quantity.toString().includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.createdAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.returnDate)).includes(query.toLowerCase())
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [currentList, query, arrangeKey])

    // for alert
    const [alert, setAlert] = useState(false)
    const [typeAlert, setTypeAlert] = useState("")
    const [alertMess, setAlertMess] = useState('')

    // for fragment
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

        Axios.delete(`/api/order/${idDeleteOrder}`, {
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

            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="Search item"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>

            <div className="list-item list-item-title">
                <div className="list-item-col item_name_col">
                    Item
                    <Arrange type="nameItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col item_category_col">
                    Category
                    <Arrange type="categoryItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col">
                    Quantity
                    <Arrange type="quantity" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col">
                    Created at
                    <Arrange type="createdAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col">
                    Return date
                    <Arrange type="returnDate" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col">
                    Permission
                </div>
                <div className="list-item-col">
                    Status
                    <Arrange type="status" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
            </div>

            {ordersRender.map((order, index) => (

                index >= currentFragment * maxOfFragment && index < (currentFragment + 1) * maxOfFragment
                &&
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={order._id}>
                    <div className="list-item-col item_name_col">
                        {order.nameItem}
                    </div>
                    <div className="list-item-col item_category_col">
                        {order.categoryItem}</div>
                    <div className="list-item-col">{order.quantity}
                    </div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(order.createdAt))}
                    </div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(order.returnDate))}
                    </div>
                    {order.status === "ok" &&
                        <OrderPDF user={user} order={order} />}
                    {order.status === "ok" &&
                        <div className="list-item-col"><i className="accept_status">Accepted</i></div>}
                    {order.status === "pending" &&
                        <div className="list-item-col">
                            <i
                                className="fa-solid fa-ban pending"
                                onClick={() => {
                                    handleBanClick(order._id)
                                }}
                            ></i>
                        </div>}
                    {order.status === "pending" &&
                        <div className="list-item-col"><i className="pending_status">Pending</i></div>}

                    {order.status === "denied" &&
                        <div className="list-item-col"><i className="fa-solid fa-download"></i></div>}
                    {order.status === "denied" &&
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
