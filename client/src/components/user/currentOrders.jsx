import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { AppContext } from '../../App';
import OrderPDF from '../../helpers/orderPDF';
import getFormattedDate from '../../utils/formatDate';
import Arrange, { arrangeList } from '../../helpers/arrange';
import ConfirmNext from '../../helpers/confirmNext';

export default function CurrentOrders({ dataUser, orderList }) {

    const { mainUser, helpers, data } = useContext(AppContext)

    const [ordersRender, setOrdersRender] = useState(orderList)
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
            setOrdersRender(arrangeList(orderList, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setOrdersRender(
                arrangeList(
                    orderList.filter(order =>
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
    }, [orderList, query, arrangeKey])


    // for fragment
    const [currentFragment, setCurrentFragment] = useState(0)
    const maxOfFragment = 10
    const numberOfFragment = Math.ceil(orderList.length * 1.0 / maxOfFragment)
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
        helpers.setOpenLoading(true)
        Axios.delete(`/api/order/${idDeleteOrder}`, {
        })
            .then(response => {
                // remove this order from list
                let indexOrder = dataUser.orders.findIndex(order => order._id === idDeleteOrder)
                dataUser.orders.splice(indexOrder, 1)
                dataUser.setOrders([...dataUser.orders])

                indexOrder = dataUser.infor.orders.findIndex(orderid => orderid === idDeleteOrder)
                dataUser.infor.orders.splice(indexOrder, 1)
                dataUser.setUser({ ...dataUser.infor })

                indexOrder = data.orders.findIndex(order => order._id === idDeleteOrder)
                data.orders.splice(indexOrder, 1)
                data.setOrders([...dataUser.orders])


                helpers.setAlert({
                    type: "success",
                    message: "Cancel order successfully!"
                })
                helpers.setOpenAlert(true)
                helpers.setOpenLoading(false)
                setOpenConfirmNext(false)
            })
            .catch(error => {
                let message = ''
                if (error.response.status === 403) {
                    message = "Your password is incorrect!"
                }
                else if (error.response.status === 400) {
                    message = error.response.data.message
                }
                else {
                    message = "Cancel order failure, please check again!"
                }

                helpers.setAlert({
                    type: "error",
                    message: message
                })
                helpers.setOpenAlert(true)
                helpers.setOpenLoading(false)
                setOpenConfirmNext(false)
            })

    }

    return (
        <div className='current_orders'>
            {
                openConfirmNext &&
                <ConfirmNext
                    setOpen={setOpenConfirmNext}
                    callback={banPendingOrder}
                    message={"Are you sure to cancel this order?"}
                />
            }
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
                <div className="list-item-col user_name_col">
                    Item
                    <Arrange type="nameItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_category_col">
                    Category
                    <Arrange type="categoryItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_quantity_col">
                    Quantity
                    <Arrange type="quantity" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_createdAt_col">
                    Created at
                    <Arrange type="createdAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_returnDate_col">
                    Return date
                    <Arrange type="returnDate" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_action_col">
                    Action
                </div>
                <div className="list-item-col user_status_col">
                    Status
                    <Arrange type="status" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
            </div>

            {ordersRender.map((order, index) => (

                index >= currentFragment * maxOfFragment && index < (currentFragment + 1) * maxOfFragment
                &&
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={order._id}>
                    <div className="list-item-col user_name_col">
                        {order.nameItem}
                    </div>
                    <div className="list-item-col user_category_col">
                        {order.categoryItem}
                    </div>
                    <div className="list-item-col user_quantity_col">
                        {order.quantity}
                    </div>
                    <div className="list-item-col user_createdAt_col">
                        {getFormattedDate(new Date(order.createdAt))}
                    </div>
                    <div className="list-item-col user_returnDate_col">
                        {getFormattedDate(new Date(order.returnDate))}
                    </div>
                    {order.status === "ok" &&
                        <OrderPDF user={dataUser.infor} order={order} className="user_action_col"/>}
                    {order.status === "ok" &&
                        <div className="list-item-col user_status_col" ><i className="accept_status">Accepted</i></div>}

                    {order.status === "pending" &&
                        <div className="list-item-col user_action_col">
                            <i
                                className="fa-solid fa-ban pending"
                                onClick={() => {
                                    handleBanClick(order._id)
                                }}
                            ></i>
                        </div>}
                    {order.status === "pending" &&
                        <div className="list-item-col user_status_col"><i className="pending_status">Pending</i></div>}

                    {order.status === "denied" &&
                        <div className="list-item-col user_action_col"><i className="fa-solid fa-download"></i></div>}
                    {order.status === "denied" &&
                        <div className="list-item-col user_status_col"><i className="denied_status">Denied</i></div>}
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
