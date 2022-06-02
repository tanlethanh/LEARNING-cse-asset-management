import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import './admin.css'
import Items from './admin/admin.item'
import Users from './admin/admin.user'
import Orders from './admin/admin.order'

export default function Admin() {

    const [currentList, setCurrentList] = useState('items')
    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [changeUsers, setChangeUsers] = useState(false)
    const [changeOrders, setChangeOrders] = useState(false)
    


    useEffect(() => {
        Axios.get("http://localhost:8266/api/item")
            .then((response) => {
                if (response.data.items) {
                    setItems(response.data.items)
                }
            })
    }, [])

    useEffect(() => {
        Axios.get("http://localhost:8266/api/user")
            .then((response) => {
                if (response.data.users) {
                    setUsers(response.data.users)
                }
            })
    }, [changeUsers]) // Change users is called when we have updated infor of users in 'Users component'

    useEffect(() => {
        Axios.get("http://localhost:8266/api/order")
            .then((response) => {
                if (response.data.orders) {
                    setOrders(response.data.orders)
                }
            })
    }, [])

    const handleClickButton = (curList) => {
        setCurrentList(curList)
    }

    return (
        <div className="admin_container">
            <div id="content">
                <div id="menu">
                    <h1 className="menu_title" >LIST</h1>

                    <button
                        className={"menu_list " + (currentList === "items" && "chosen")}
                        onClick={() => handleClickButton("items")}
                    >
                        Items
                    </button>

                    <button
                        className={"menu_list " + (currentList === "users_register" && "chosen")}
                        onClick={() => handleClickButton("users_register")}
                    >
                        Register users
                    </button>

                    <button
                        className={"menu_list " + (currentList === "users_all" && "chosen")}
                        onClick={() => handleClickButton("users_all")}
                    >
                        All of users
                    </button>

                    <button
                        className={"menu_list " + (currentList === "orders_pending" && "chosen")}
                        onClick={() => handleClickButton("orders_pending")}
                    >
                        Pending orders
                    </button>

                    <button
                        className={"menu_list " + (currentList === "orders_processing" && "chosen")}
                        onClick={() => handleClickButton("orders_processing")}
                    >
                        Processing orders
                    </button>

                    <button
                        className={"menu_list " + (currentList === "orders_complete" && "chosen")}
                        onClick={() => handleClickButton("orders_complete")}
                    >
                        Complete order
                    </button>

                </div>

                <div id="list">

                    {currentList === "items" &&
                        <Items items={items} />
                    }
                    {currentList.substring(0, currentList.indexOf("_")) === "users" &&
                        <Users users={users} nameList={currentList} setChangeUsers={setChangeUsers} changeUsers={changeUsers} />
                    }
                    {currentList.substring(0, currentList.indexOf("_")) === "orders" &&
                        <Orders orders={orders} nameList={currentList} setChangeOrders={setChangeOrders} changeOrders={changeOrders} />
                    }

                </div>
            </div>
        </div>
    )
}