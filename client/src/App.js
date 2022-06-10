import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from "axios";
import { Header, Footer } from './components/headerfooter/headerfooter';
import Signup from './components/auth/signup'
import Dashboard from './components/dashboard/dashboard'
import Homepage from './components/homepage/homepage'
import Authpage from './components/auth/authpage'
import DetailUser from './components/dashboard/admin/admin.user.detail';
import DetailItem from './components/dashboard/admin/admin.item.detail'

function App() {
    // To ensure that use cookies and sessions
    Axios.defaults.withCredentials = true;

    const [user, setUser] = useState({})

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

    const [checklist, setChecklist] = useState(false)
    return (
        <div>
            <Header checklist={checklist} setChecklist={setChecklist} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Homepage checklist={checklist} setChecklist={setChecklist} />
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
                        <DetailUser/>
                    }
                />
                <Route
                    path="/item/detail/:id"
                    element={
                        <DetailItem/>
                    }
                />
            </Routes>
            <Footer />
        </div>



    )
}

export default App