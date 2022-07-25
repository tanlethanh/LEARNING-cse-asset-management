import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../../App"
import { useSearchParams } from "react-router-dom"
import BorrowingOrders from "./borrowingOrders"
import CurrentOrders from "./currentOrders"
import ReturnedOrders from "./returnedOrders"
import NotFoundPage from "../../helpers/notFoundPage"
import '../../styles/user.css'

export default function User({ dataUser }) {

    const [searchParams, setSearchParams] = useSearchParams()
    const typeList = searchParams.get('tab')

    const { mainUser, helpers } = useContext(AppContext)

    const [currentList, setCurrentList] = useState([])
    const [borrowingList, setBorrowingList] = useState([])
    const [returnedList, setReturnedList] = useState([])


    useEffect(() => {
        const newCurrentList = []
        const newBorrowingList = []
        const newReturnedList = []
        dataUser.orders.map(order => {
            if (order.status === "pending" || order.status === "denied" || order.status === "ok") {
                newCurrentList.push(order)
            }

            if (order.status === "ok") {
                newBorrowingList.push(order)
            }

            if (order.status === "denied" || order.status === "done") {
                newReturnedList.push(order)
            }
        })
        setCurrentList(newCurrentList)
        setBorrowingList(newBorrowingList)
        setReturnedList(newReturnedList)

    }, [dataUser.orders]) // list of orders need to reload when this user has updated

    if (!mainUser.infor.enable) return <NotFoundPage />

    return (
        <div className={(mainUser === dataUser) ? "temp_header" : ""}>
            <div id="content">
                <div id="menu">
                    <h1 className="menu_title" >LIST</h1>
                    <button
                        className={(typeList === "current" || !typeList) ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ tab: "current" }) }}
                    >
                        Current list
                    </button>
                    <button
                        className={typeList === "borrowing" ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ tab: "borrowing" }) }}
                    >
                        Borrowing list
                    </button>
                    <button
                        className={typeList === "returned" ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ tab: "returned" }) }}
                    >
                        Returned list
                    </button>
                </div>

                <div id="list">
                    {(typeList === "current" || !typeList) &&
                        <CurrentOrders orderList={currentList} dataUser={dataUser} />}
                    {typeList === "borrowing" &&
                        <BorrowingOrders orderList={borrowingList} dataUser={dataUser} />}
                    {typeList === "returned" &&
                        <ReturnedOrders orderList={returnedList} dataUser={dataUser} />}
                </div>
            </div>
        </div>

    )
}