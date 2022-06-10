import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import Items from './admin/admin.item'
import Users from './admin/admin.user'
import Orders from './admin/admin.order'

export default function Admin() {

    const [currentList, setCurrentList] = useState('items')
    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState({})
    const [changeItems, setChangeItems] = useState(false)
    const [changeUsers, setChangeUsers] = useState(false)
    const [changeOrders, setChangeOrders] = useState(false)

    useEffect(() => {
        Axios.get("http://localhost:8266/api/item")
            .then((response) => {
                if (response.data.items) {
                    setItems(response.data.items)
                }
            })
    }, [changeItems])

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
                    const curOrders = {
                        pending: response.data.orders.filter(order => order.status === 'pending'),
                        ok: response.data.orders.filter(order => order.status === 'ok'),
                        complete: response.data.orders.filter(order => order.status === 'done' || order.status === 'denied')
                    }
                    console.log("Set orders here", curOrders)
                    setOrders(curOrders)
                }
            })
    }, [changeOrders])

    const handleClickButton = (curList) => {
        console.log("hello click")
        setCurrentList(curList)
    }

    return (
        <div className="admin_container">
            <div id="content">
                <div id="menu">
                    <h1 className="menu_title" >DASH BOARD</h1>

                    <h3 className='menu_list_title'>Items, devices</h3>
                    <button
                        className={"menu_list_admin " + (currentList === "items" && "chosen")}
                        onClick={() => handleClickButton("items")}
                    >
                        Items
                    </button>

                    <h3 className='menu_list_title'>Users</h3>
                    <button
                        className={"menu_list_admin " + (currentList === "users_register" && "chosen")}
                        onClick={() => handleClickButton("users_register")}
                    >
                        Register users
                    </button>

                    <button
                        className={"menu_list_admin " + (currentList === "users_all" && "chosen")}
                        onClick={() => handleClickButton("users_all")}
                    >
                        All of users
                    </button>

                    <h3 className='menu_list_title'>Oders</h3>
                    <button
                        className={"menu_list_admin " + (currentList === "orders_pending" && "chosen")}
                        onClick={() => handleClickButton("orders_pending")}
                    >
                        Pending orders
                    </button>

                    <button
                        className={"menu_list_admin " + (currentList === "orders_ok" && "chosen")}
                        onClick={() => handleClickButton("orders_ok")}
                    >
                        Processing orders
                    </button>

                    <button
                        className={"menu_list_admin " + (currentList === "orders_complete" && "chosen")}
                        onClick={() => handleClickButton("orders_complete")}
                    >
                        Complete order
                    </button>

                </div>

                <div id="list">

                    {currentList === "items" &&
                        <Items
                            items={items}
                            setChangeItems={setChangeItems}
                            changeItems={changeItems}
                        />
                    }
                    {currentList.substring(0, currentList.indexOf("_")) === "users" &&
                        <Users
                            users={users}
                            nameList={currentList}
                            setChangeUsers={setChangeUsers}
                            changeUsers={changeUsers}
                        />
                    }
                    {console.log("Order props here", orders)}
                    {currentList.substring(0, currentList.indexOf("_")) === "orders" &&
                        <Orders
                            orders={orders}
                            items={items}
                            users={users}
                            nameList={currentList.substring(currentList.indexOf("_") + 1, currentList.length)}
                            setChangeOrders={setChangeOrders}
                            changeOrders={changeOrders}
                        />
                    }

                </div>
            </div>
        </div>
    )
}