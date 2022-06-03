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
            <div className='hp_card'>
                <div className='hp_leftcard'>
                    <img src="..." class="img-fluid rounded-start" alt="..." />
                </div>
                <div className='hp_rightcard'>
                    <p className='hp_info' id='hp_name'><b>{props.name}</b></p>
                    <p className='hp_info'>{props.quantity}</p>
                    <p className='hp_info'>{props.category}</p>
                    <p className='hp_info' id='hp_des'>{props.description}</p>
                    <button type='button' className='hp_reg'><b>REGISTER</b></button>
                </div>
            </div>            
        )
    }

    return (
        <div className='homepage-container'> 
            <h1 className='hp_h1'><b>AVAILABLE DEVICE</b></h1>
            <div title="searchBox" className="container-fluid" id='hp_search'>
                <form className="d-flex" role="search">
                    <input className="searchInput" type="search" placeholder="Search..." aria-label="Search" />
                </form>
            </div>
            <div className='hp_container'> {
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
            <hr className='hp_line'></hr>
            <div>
                <h1 className='hp_h1'><b>UNAVAILABLE DEVICE</b></h1>
            </div>
        </div>
    )
}
