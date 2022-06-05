import './homepage.css'
import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AvaiItem from './homepageItem/homeAvai';
import UnavaiItem from './homepageItem/homeUnavai';


export default function Homepage(props) {

    const [items,setItems] = useState([])
    const arrUnavai = []
    const arrAvai = [] 
    const [avai, setAvai] = useState([])
    const [unavai, setUnavai] = useState([])
    
    useEffect(() => {
        console.log("Get login")
        Axios.get("http://localhost:8266/api/item")
            .then((response) => {
                if (response.data.items) {
                    response.data.items.map((item, index) => {
                        {if (item.available != 0) {
                            arrAvai.push(item)
                        } else {
                            arrUnavai.push(item)
                        }}
                        if (index == response.data.items.length -1) {
                            setAvai(arrAvai)
                            setUnavai(arrUnavai)
                        }
                    });
                }
            });
    
    }, [])
    

    return (
        <div>
            
            <div className='homepage-container'>
                <p className='homepage-title'><b>AVAILABLE DEVICE</b></p>
                <div class="list-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>
                <div className='hp_container'>
                    <AvaiItem avai = {avai} checklist={props.checklist} setChecklist={props.setChecklist}/>           
                </div> 
                
                <hr className='hp_line'></hr>
                <p className='homepage-title'><b>UNAVAILABLE DEVICE</b></p>
                <div className='hp_container'> 
                    {unavai.map((item) => {
                        return(
                            <UnavaiItem
                                key={item._id}
                                name={item.name}
                                quantity={item.available}
                                category={item.category}
                                description={item.description}
                            />
                        )
                    })}      
                </div>
            </div>
        </div>
    )
}
