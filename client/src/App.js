import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from "axios";

import { Header, Footer } from './components/headerfooter/headerfooter';
import Signup from './components/auth/signup'
import Dashboard from './components/dashboard/dashboard'
import Homepage from './components/homepage/homepage'
import Authpage from './components/auth/authpage'

function App() {
    console.log("Start app")

    // To ensure that use cookies and sessions
    Axios.defaults.withCredentials = true;

    const [user, setUser] = useState({})

    // Change title of page when user is logged in
    console.log(user, "Hello user")
    useEffect(() => {
        document.title = `Asset of ${user.fullName || 'me'}`
    }, [user])

    // Check if user is logged in before
    useEffect(() => {
        console.log("Get login")
        Axios.get("http://localhost:8266/api/auth")
            .then((response) => {
                console.log(response.data)
                if (response.data.user) {
                    setUser(response.data.user)
                }
            });

    }, [])

    return (
        <div>
            <Header />
            <Routes>
                {console.log(user, "In route")}
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={user.email ? <Dashboard setUser={setUser} user={user}/> : <Authpage setUser={setUser}/>} />
            </Routes>
            <Footer />
        </div>



    )
}

export default App