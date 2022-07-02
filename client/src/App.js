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

export const AppContext = React.createContext()

function App() {
    // To ensure that use cookies and sessions
    Axios.defaults.withCredentials = true;

    const [user, setUser] = useState({})
    const [cart, setCart] = useState([])

    // Change title of page when user is logged in
    useEffect(() => {
        document.title = `Asset of ${user.fullName || 'me'}`
    }, [user])

    // Check if user is logged in before
    useEffect(() => {
        Axios.get("http://localhost:8266/api/auth")
            .then((response) => {
                if (response.data.user) {
                    setUser(response.data.user)
                }
            });

    }, [])


    return (
        // <div onClick={(event) => {
        //     const targetPrefClass = event.target.className;
        //     const target = targetPrefClass.substring(0, targetPrefClass.indexOf('-'))
        //     const targetPrefClassParent = event.target.parentNode.className
        //     const targetParent = targetPrefClassParent.substring(0, targetPrefClassParent.indexOf('-'))
        //     const targetPrefGrandParent = event.target.parentNode.parentNode.className
        //     const targetGrandParent = targetPrefGrandParent.substring(0, targetPrefGrandParent.indexOf('-'))

        //     // if (target !== 'checklist' && targetParent !== 'checklist' && targetGrandParent !== 'checklist') {
        //     //     if (checklist === true) {
        //     //         setChecklist(false)
        //     //     }
        //     // }
        // }}>
        // </div>
            <AppContext.Provider value={{cart: cart, setCart: setCart}}>
                <Header />
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
                            <Dashboard setUser={setUser} user={user} /> :
                            <Authpage setUser={setUser} />
                        }

                    />
                    <Route
                        path="/user/detail/:id"
                        element={
                            <DetailUser />
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
            </AppContext.Provider>

    )
}

export default App