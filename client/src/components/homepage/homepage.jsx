import React, { useState, useEffect, useContext } from 'react';
import Axios from "axios";
import AvaiItem from './homepageItem/homeAvai';
import UnavaiItem from './homepageItem/homeUnavai';
import '../../styles/homepage.css';

export default function Homepage(props) {

    const arrUnavai = []
    const arrAvai = []
    const [avai, setAvai] = useState([])
    const [unavai, setUnavai] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:8266/api/item")
            .then((response) => {
                if (response.data.items) {
                    response.data.items.map((item, index) => {
                        {
                            if (item.available !== 0) {
                                arrAvai.push(item)
                            } else {
                                arrUnavai.push(item)
                            }
                        }
                        if (index === response.data.items.length - 1) {
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
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>

                <div className='homepage-item-container'>
                    <div className="homepage-card-container">
                        {avai.map((item) => {
                            return (
                                <AvaiItem item={item} key={item._id}/>
                            )
                        })}
                    </div>
                </div>

                <hr className='homepage-line'></hr>

                {unavai.length > 0 && <p className='homepage-title un-title'>UNAVAILABLE DEVICE</p>}

                <div className='homepage-item-container'>
                    <div className="homepage-card-container">
                        {unavai.map((item) => {
                            return (
                                <UnavaiItem
                                    name={item.name}
                                    available={item.available}
                                    quantity={item.quantity}
                                    category={item.category}
                                    description={item.description}
                                    key={item._id}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
