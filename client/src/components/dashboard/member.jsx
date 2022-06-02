import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './member.css';
import Table from './memberTable';


export default function Member(props) {
    const tabs = ['Waiting list', 'Borrowing list', 'Returned list']
    const arrWait = []
    const arrBorrow = []
    const arrReturn = []
    const [currentTab, setCurrentTab] = useState('Waiting list')
    const [waitingList, setWaitingList] = useState([])
    const [borrowList, setBorrowList] = useState([])
    const [returnList, setReturnList] = useState([])


    useEffect(() => {
        props.user.orders.map((orderid) => {
            Axios.get(`http://localhost:8266/api/order/${orderid}`)
                .then((response) => {
                    const testWait = response.data.order.status != "done" && currentTab === "Waiting list"
                    const testBorrow = response.data.order.status != "denied" && response.data.order.status != "done" && currentTab === "Borrowing list" 
                    if (testWait) {
                        arrWait.push(response.data.order)
                    } else if (testBorrow){
                        arrBorrow.push(response.data.order)
                    } else {
                        arrReturn.push(response.data.order)
                    }
                });
        });
        setWaitingList(arrWait);
        setBorrowList(arrBorrow);
        setReturnList(arrReturn);
    }, [])
    

    return (
        <div className="content">
            <div className="menu">
                <h1 className="menu_title" >LIST</h1>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={currentTab === tab ? "menu_list chosen" : "menu_list"}
                        onClick={() => setCurrentTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div id="list">
            
                <div class="list-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item"/>
                </div>
                
                <div class="list-item list-item-title">
                    <div class="list-item-col">Category</div>
                    <div class="list-item-col item-col-name">Item</div>
                    <div class="list-item-col">Quantity</div>
                    <div class="list-item-col">Date</div>
                    <div class="list-item-col">Permission</div>
                    <div class="list-item-col">Status</div>
                </div>
                
                {console.log(waitingList)}
                
                {currentTab === "Waiting list" &&
                    <Table currentList = {waitingList} setCurrentList = {setWaitingList} />}
                {currentTab === "Borrowing list" &&
                    <Table currentList = {borrowList} setCurrentList = {setBorrowList} />}
                {currentTab == "Returned" &&
                    <Table currentList = {returnList} setCurrentList = {setReturnList} />}
            </div>
        </div>
        
    )
}