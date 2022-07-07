import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import '../../styles/member.css';
import Waiting from './member/memberWaiting';
import Borrow from './member/memberBorrow';
import Returned from './member/memberReturn';
import { AppContext } from '../../App';


export default function Member(props) {
    const tabs = ['Waiting list', 'Borrowing list', 'Returned list']
    const arrWait = []
    const arrBorrow = []
    const arrReturn = []
    const [currentTab, setCurrentTab] = useState('Waiting list')
    const [waitingList, setWaitingList] = useState([])
    const [borrowList, setBorrowList] = useState([])
    const [returnList, setReturnList] = useState([])
    const {isUpdated, setIsUpdated} = useContext(AppContext)

    useEffect(() => {
        props.user.orders.map((orderid, index) => {
            Axios.get(`http://localhost:8266/api/order/${orderid}`)
                .then((response) => {
                    if (response.data.order.status !== "done") {
                        arrWait.push(response.data.order)
                        if (response.data.order.status === "ok") {
                            arrBorrow.push(response.data.order)
                        }
                    } else {
                        arrReturn.push(response.data.order)
                    }
                    if (index === props.user.orders.length - 1) {
                        setWaitingList(arrWait)
                        setBorrowList(arrBorrow)
                        setReturnList(arrReturn)
                        console.log("Reload data")
                    }
                });
        });
    }, [isUpdated])

    return (
        <div id="content">
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
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>

                {currentTab === "Waiting list" &&
                    <Waiting
                        currentList={waitingList}
                        setCurrentList={setWaitingList}
                        user={props.user}
                    />}
                {currentTab === "Borrowing list" &&
                    <Borrow currentList={borrowList} setCurrentList={setBorrowList} />}
                {currentTab === "Returned list" &&
                    <Returned currentList={returnList} setCurrentList={setReturnList} />}
            </div>
        </div>

    )
}