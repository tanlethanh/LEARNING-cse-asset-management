import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import Items from './admin.item/admin.item'
import Users from './admin.user/admin.user'
import Orders from './admin.order/admin.order'
import { Route } from 'react-router';
import '../../styles/waiting.css';

export const dataContext = React.createContext()

export default function Admin({ setUser, user, setAdminData, currentList, setCurrentList }) {

    const [items, setItems] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState({})
    const [changeItems, setChangeItems] = useState(false)
    const [changeUsers, setChangeUsers] = useState(false)
    const [changeOrders, setChangeOrders] = useState(false)
    const [waitingLoad, setWaitingLoad] = useState(false)

    useEffect(()=>{
        console.log("data change")
        setAdminData({
            items: items,
            users: users,
            orders: orders,
            currentList: currentList
        })
    },[items, users, orders, currentList])


    useEffect(() => {
        console.log("get data of items in admin site")
        setWaitingLoad(true)
        Axios.get("/api/item")
            .then((response) => {
                if (response.data.items) {
                    setItems(response.data.items)
                }
                setWaitingLoad(false)
            })
    }, [changeItems])

    useEffect(() => {
        console.log("get data of users in admin site")
        setWaitingLoad(true)
        Axios.get("/api/user")
            .then((response) => {
                if (response.data.users) {
                    setUsers(response.data.users)
                }
                setWaitingLoad(false)
            })
    }, [changeUsers]) // Change users is called when we have updated infor of users in 'Users component'

    useEffect(() => {
        console.log("get data of orders in admin site")
        setWaitingLoad(true)
        Axios.get("/api/order")
            .then((response) => {
                if (response.data.orders) {
                    const curOrders = {
                        pending: response.data.orders.filter(order => order.status === 'pending'),
                        ok: response.data.orders.filter(order => order.status === 'ok'),
                        complete: response.data.orders.filter(order => order.status === 'done' || order.status === 'denied')
                    }
                    setOrders(curOrders)
                }
                setWaitingLoad(false)
            })
    }, [changeOrders])

    const handleClickButton = (curList) => {
        setCurrentList(curList)
    }

    return (
        <dataContext.Provider value={{user, items, users, orders}}>
            <div className="admin_container">
                {
                    waitingLoad && 
                    <div className="load">
                        <div className="waiting-load">
                            <span className="fa-solid fa-spinner rotate-around icon"></span>
                        </div>
                    </div>
                }
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
                            Member
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
                            Complete orders
                        </button>

                    </div>

                    <div id="list">

                        {currentList === "items" &&
                            <Items
                                admin={user}
                                items={items}
                                setChangeItems={setChangeItems}
                                changeItems={changeItems}
                            />
                        }
                        {currentList.substring(0, currentList.indexOf("_")) === "users" &&
                            <Users
                                admin={user}
                                users={users}
                                enable={currentList === "users_register" ? false : true}
                                setChangeUsers={setChangeUsers}
                                changeUsers={changeUsers}
                            />
                        }
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
        </dataContext.Provider>
    )
}