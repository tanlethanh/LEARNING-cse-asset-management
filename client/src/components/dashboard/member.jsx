import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import '../../styles/member.css';
import '../../styles/waiting.css';
import Waiting from './member/memberWaiting';
import Borrow from './member/memberBorrow';
import Returned from './member/memberReturn';
import { AppContext } from '../../App';


export default function Member({ user, setUser, isUpdatedCurrentUser, setIsUpdatedCurrentUser, currentTab, setCurrentTab }) {
    const tabs = ['Current orders', 'Borrowing orders', 'Returned orders']
    const arrWait = []
    const arrBorrow = []
    const arrReturn = []
    const [waitingList, setWaitingList] = useState([])
    const [borrowList, setBorrowList] = useState([])
    const [returnList, setReturnList] = useState([])
    const [waitingLoad, setWaitingLoad] = useState(false)

    useEffect(() => {
        console.log("reload data orders of current user")
        user.orders.map((orderid, index) => {
            setWaitingLoad(true)
            Axios.get(`/api/order/${orderid}`)
                .then((response) => {
                    if (response.data.order.status !== "done") {
                        arrWait.push(response.data.order)
                        if (response.data.order.status === "ok") {
                            arrBorrow.push(response.data.order)
                        }
                    } else {
                        arrReturn.push(response.data.order)
                    }
                    if (index === user.orders.length - 1) {
                        setWaitingList(arrWait)
                        setBorrowList(arrBorrow)
                        setReturnList(arrReturn)
                    }
                    setWaitingLoad(false)
                });
        });
    }, [user]) // list of orders need to reload when this user has updated

    return (
        <div id="content">
            {
                waitingLoad && 
                <body className="load">
                    <div className="waiting-load">
                        <span className="fa-solid fa-spinner rotate-around icon"></span>
                    </div>
                </body>
            }
            <div id="menu">
                <h1 className="menu_title" >LIST</h1>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={currentTab === tab ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setCurrentTab(tab) }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div id="list">
                {currentTab === "Current orders" &&
                    <Waiting
                        currentList={waitingList}
                        setCurrentList={setWaitingList}
                        user={user}
                        isUpdatedCurrentUser={isUpdatedCurrentUser}
                        setIsUpdatedCurrentUser={setIsUpdatedCurrentUser}
                    />}
                {currentTab === "Borrowing orders" &&
                    <Borrow
                        currentList={borrowList}
                        setCurrentList={setBorrowList}
                        user={user}
                    />}
                {currentTab === "Returned orders" &&
                    <Returned
                        currentList={returnList}
                        setCurrentList={setReturnList}
                    />}
            </div>
        </div>

    )
}