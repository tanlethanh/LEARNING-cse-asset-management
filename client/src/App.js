import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Axios from "axios";

import { Header, Footer } from './components/headerfooter/headerfooter';
import Signup from './components/auth/signup'
import Dashboard from './components/dashboard/dashboard'
import Homepage from './components/homepage/homepage'
import Authpage from './components/auth/authpage'

function App() {
    console.log("Hello World!")
    Axios.defaults.withCredentials = true;

    const [user, setUser] = useState({})
    const [isLogined, setIsLogined] = useState(false)

    useEffect(() => {
        document.title = `Asset of ${user.fullName || 'me'}`
    })

    useEffect(() => {
        console.log("Get login")

        
        Axios.get("http://localhost:8266/api/auth")
            .then((response) => {
                console.log(response.data)
                if (response.data.user) {
                    setUser(response.data.user)
                }
            });

        
        // fetch("http://localhost:8266/api/auth", {
        //     method: 'GET'
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(data)
        //         if (data.user) {
        //             setUser(data.user)
        //         }
        //     })


    }, [isLogined])

    return (
        <div>
            <Header />


            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<Authpage setIsLogined={setIsLogined} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={user ? <Navigate to="/auth" /> : <Dashboard />} />
            </Routes>


            {/* <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route
                        path="messages"
                        element={<DashboardMessages />}
                    />
                    <Route path="tasks" element={<DashboardTasks />} />
                </Route>
                <Route path="about" element={<AboutPage />} />
            </Routes> */}

            <Footer />


            {/* <Routes>
            </Routes> */}
        </div>



    )
}

export default App