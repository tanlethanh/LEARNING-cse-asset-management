import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from "axios";
import { Header, Footer } from './components/headerfooter/headerfooter';
import Homepage from './components/homepage/homepage'
import Signup from './components/auth/signup'
import Login from './components/auth/login';
import Admin from './components/admin/admin';
import User from './components/user/user';
import UserById from './components/user/userById';
import ItemById from './components/item/itemById';
import Cart from './components/cart';
import Alert from './helpers/alert';
import Loading from './helpers/loading';
import NotFoundPage from './helpers/notFoundPage';
import './styles/app.css'
import './styles/auth.css'

export const AppContext = React.createContext()

function App() {
    // To ensure that use cookies and sessions
    Axios.defaults.withCredentials = true;

    // all of data need to render
    const [items, setItems] = useState([])
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const data = {
        items: items,
        setItems: setItems,
        users: users,
        setUsers: setUsers,
        orders: orders,
        setOrders: setOrders
    }


    // data of main user
    const [user, setUser] = useState({})
    const [ordersOfUser, setOrdersOfUser] = useState([])
    const [isUpdatedInfor, setIsUpdatedInfor] = useState(false)
    const [isUpdatedOrders, setIsUpdatedOrders] = useState(false)
    const mainUser = {
        infor: user,
        setUser: setUser,
        orders: ordersOfUser,
        setOrders: setOrdersOfUser,
        setIsUpdateInfor: setIsUpdatedInfor,
        setIsUpdatedOrders: setIsUpdatedOrders
    }

    // helper
    const [openAlert, setOpenAlert] = useState(false)
    const [alert, setAlert] = useState({
        type: "",
        message: ""
    })
    const [openLoading, setOpenLoading] = useState(false)
    const helpers = {
        setAlert: setAlert,
        setOpenLoading: setOpenLoading,
        setOpenAlert: setOpenAlert
    }


    // cart
    const [cart, setCart] = useState([])
    const [openCart, setOpenCart] = useState(false)


    // toggle cart
    const onClickToggleCart = (target) => {
        const currentClass = target.className
        const parentClass = target.parentNode.className
        const parent2Class = target.parentNode.parentNode.className
        if (
            currentClass.split('-')[0] !== 'checklist'
            && parentClass.split('-')[0] !== 'checklist'
            && parent2Class.split('-')[0] !== 'checklist'
            && currentClass.split('-')[0] !== 'react'
            && parentClass.split('-')[0] !== 'react'
            && parent2Class.split('-')[0] !== 'react'
            && currentClass !== "homepage_reg"
            && currentClass !== "homepage_added"
        ) {
            setOpenCart(false)
        }
    }

    // Check if user is logged and get all of item for the first time
    useEffect(() => {
        // Get all of items
        if (data.items.length == 0) {
            setOpenLoading(true)
            Axios.get("/api/item")
                .then((response) => {
                    setItems(response.data.items)
                    setOpenLoading(false)
                })
                .catch(err => {
                    setOpenLoading(false)
                })
        }

        setOpenLoading(true)
        Axios.get("/api/auth")
            .then((response) => {
                setUser(response.data.user)
                setOpenLoading(false)
            })
            .catch(err => {
                setOpenLoading(false)
            })
    }, [])

    // Update infor or order list of user
    // fetch data orders of user when either the first time mount app or orders have updated
    useEffect(() => {
        if (user.enable && (ordersOfUser.length === 0 || isUpdatedOrders)) {
            const orders = []
            setOpenLoading(true)
            user.orders.map((orderid, index) => {
                Axios.get(`/api/order/${orderid}`)
                    .then((response) => {
                        orders.push(response.data.order)
                        // updated orders of use when get all of order complete
                        if (index === user.orders.length - 1) {
                            setOrdersOfUser(orders)
                            setIsUpdatedOrders(false)
                            setOpenLoading(false)
                        }
                    })
                    .catch(() => {
                        setOpenLoading(false)
                    })
            })
        }

        if (user.enable && isUpdatedInfor) {
            setOpenLoading(true)
            Axios.get("/api/auth")
                .then((response) => {
                    setUser(response.data.user)
                    setIsUpdatedOrders(false)
                    setOpenLoading(false)
                })
                .catch(err => {
                    setOpenLoading(false)
                })
        }

        if (user.fullName) {
            const names = user.fullName.split(' ')
            document.title = 'CSE Asset - ' + names[names.length - 1]
        }
        else {
            document.title = 'CSE Asset'
        }

    }, [user, isUpdatedInfor, isUpdatedOrders])

    // Fetch all of order, user for admin
    useEffect(() => {
        if (user.isAdmin) {
            setOpenLoading(true)
            Axios.get("/api/user")
                .then((response) => {
                    setUsers(response.data.users)
                    setOpenLoading(false)
                })
                .catch(err => {
                    setOpenLoading(false)
                })

            setOpenLoading(true)
            Axios.get("/api/order")
                .then((response) => {
                    setOrders(response.data.orders)
                    setOpenLoading(false)
                })
                .catch(err => {
                    setOpenLoading(false)
                })
        }

    }, [user])


    return (
        <AppContext.Provider value={{
            cart: cart,
            setCart: setCart,
            mainUser: mainUser,
            data: data,
            helpers: helpers

        }} >
            <div onClick={(e) => {
                onClickToggleCart(e.target)
            }}
                id="App"
            >

                {openAlert && <Alert alert={alert} setOpenAlert={setOpenAlert} />}
                {openLoading && <Loading />}
                {openCart && <Cart />}

                <Header
                    openCart={openCart}
                    setOpenCart={setOpenCart}
                />
                <Routes>
                    <Route index element={<Homepage />} />
                    <Route path="home" element={<Homepage />} />
                    <Route path="login" element={<Login setUser={setUser} />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="mylist" element={<User dataUser={mainUser} />} >
                    </Route>
                    <Route path="dashboard" element={<Admin />} />
                    <Route path="user/:id" element={<UserById />} />
                    <Route path="item/:id" element={<ItemById />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </div>
        </AppContext.Provider>

    )
}

export default App