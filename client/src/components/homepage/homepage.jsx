import './homepage.css'
import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';


export default function Homepage(props) {

    const [items,setItem] = useState([])

    useEffect(() => {
        console.log("Get login")
        Axios.get("http://192.168.1.45:8266/api/item")
            .then((response) => {
                if (response.data.items) {
                    setItem(response.data.items)
                }
            });
    
    }, [])
    
    const Item = props => {
        return (
            <div className='card'>
                <div className='leftcard'>
                    <img src="..." class="img-fluid rounded-start" alt="..." />
                </div>
                <div className='rightcard'>
                    <p className='info' id='name'><b>{props.name}</b></p>
                    <p className='info'>{props.quantity}</p>
                    <p className='info'>{props.category}</p>
                    <p className='info' id='des'>{props.description}</p>
                    <button type='button' className='reg'><b>REGISTER</b></button>
                </div>
            </div>            
        )
    }

    return (
        <div className='homepage-container'> 
            <h1><b>AVAILABLE DEVICE</b></h1>
            <div title="searchBox" className="container-fluid" id='Search'>
                <form className="d-flex" role="search">
                    <input className="searchInput" type="search" placeholder="Search..." aria-label="Search" />
                </form>
            </div>
            <div className='container'> {
                    items.map((item) => {
                        return (
                            <Item
                                key={item._id}
                                name={item.name}
                                quantity={item.available}
                                category={item.category}
                                description={item.description}
                            />
                        )
                    })
                }      
            </div> 
            <hr></hr>
            <div>
                <h1><b>UNAVAILABLE DEVICE</b></h1>
            </div>
        </div>
    )
}
