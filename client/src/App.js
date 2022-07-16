import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from "axios";
import { Header, Footer } from './components/headerfooter/headerfooter';
import Signup from './components/auth/signup'
import Dashboard from './components/dashboard/dashboard'
import Homepage from './components/homepage/homepage'
import Authpage from './components/auth/authpage'
import DetailUser from './components/dashboard/admin.user/admin.user.detail';
import DetailItem from './components/dashboard/admin.item/admin.item.detail'
import { getItems, getUsers, getOrders } from './fetchAPI/getAll';

export const AppContext = React.createContext()

function App() {
    // To ensure that use cookies and sessions
    Axios.defaults.withCredentials = true;

    // all data
    const [usersList, setUsersList] = useState([])
    const [itemsList, setItemsList] = useState([])
    const [ordersList, setOrdersList] = useState([])


    const [user, setUser] = useState({})
    const [cart, setCart] = useState([])
    const [openCart, setOpenCart] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [isUpdatedMainUser, setIsUpdatedMainUser] = useState(false)
    const [currentList, setCurrentList] = useState('items')
    const [currentTab, setCurrentTab] = useState('Current orders')

    // Change title of page when user is logged in
    useEffect(() => {

        if (user && user.isAdmin) {
            Axios.get("/api/user")
                .then((response) => {
                    setUsersList(response.data.users)
                })
                .catch(err => {

                })

            Axios.get("/api/order")
                .then((response) => {
                    setOrdersList(response.data.orders)
                })
                .catch(err => {

                })
        }

        if (itemsList.length == 0) {
            Axios.get("/api/item")
                .then((response) => {
                    setItemsList(response.data.items)
                })
                .catch(err => {

                })
        }

        document.title = `Asset of ${user.fullName || 'me'}`
    }, [user])

    useEffect(() => {
        console.log("Items list: " + itemsList)
        console.log("Orders list: " + ordersList)
        console.log("Users list: " + usersList)

    }, [itemsList, usersList, ordersList])


    // Check if user is logged in before
    useEffect(() => {
        Axios.get("/api/auth")
            .then((response) => {
                if (response.data.user) {
                    setUser(response.data.user)
                }
            })
            .catch(err => {})

    }, [isUpdatedMainUser])

    return (
        <AppContext.Provider value={{
            cart: cart,
            setCart: setCart,
            isUpdatedMainUser: isUpdatedMainUser,
            setIsUpdatedMainUser: setIsUpdatedMainUser,
            mainUser: user,
            itemsList: itemsList,
            usersList: usersList,
            ordersList: ordersList,
            setItemsList: setItemsList,
            setUsersList: setUsersList,
            setOrdersList: setOrdersList
        }} >
            <div onClick={(e) => {
                const currentClass = e.target.className
                const parentClass = e.target.parentNode.className
                const parent2Class = e.target.parentNode.parentNode.className
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
            }}>
                <Header
                    openCart={openCart}
                    setOpenCart={setOpenCart}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    user={user}
                    currentList={currentList}
                    setCurrentList={setCurrentList}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Homepage />
                        }
                    />
                    <Route
                        path="/signup"
                        element={<Signup />} />
                    <Route
                        path="/dashboard"
                        element={user.email ?
                            <Dashboard
                                setUser={setUser}
                                user={user}
                                adminSite={true}
                                currentList={currentList}
                                setCurrentList={setCurrentList}
                                currentTab={currentTab}
                                setCurrentTab={setCurrentTab}
                            /> :
                            <Authpage setUser={setUser} />
                        }

                    />
                    <Route
                        path="/dashboard/me"
                        element={user.email ?
                            <Dashboard
                                setUser={setUser}
                                user={user}
                                adminSite={false}
                                currentList={currentList}
                                setCurrentList={setCurrentList}
                                currentTab={currentTab}
                                setCurrentTab={setCurrentTab}
                            /> :
                            <Authpage setUser={setUser} />
                        }

                    />
                    <Route
                        path="/user/detail/:id"
                        element={
                            <DetailUser admin={user} />
                        }
                    />
                    <Route
                        path="/item/detail/:id"
                        element={
                            <DetailItem />
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </AppContext.Provider>

    )
}

export default App