import React, { useState, useEffect } from 'react';
import Axios from "axios";
import AvaiItem from './homepageItem/homeAvai';
import UnavaiItem from './homepageItem/homeUnavai';
import '../../styles/homepage.css';
import '../../styles/waiting.css';

export default function Homepage(props) {

    const [avai, setAvai] = useState([])
    const [unavai, setUnavai] = useState([])

    //search
    const [query, setQuery] = useState("")
    const [itemsAvaiRender, setItemsAvaiRender] = useState([])
    const [itemsUnavaiRender, setItemsUnavaiRender] = useState([])
    const [searchFirst, setSearchFirst] = useState(false)
    const [waitingLoad, setWaitingLoad] = useState(false)

    useEffect(() => {
        setWaitingLoad(true)
        Axios.get("/api/item")
            .then((response) => {
                if (response.data.items) {
                    response.data.items.map((item, index) => {
                        {
                            if (item.available !== 0) {
                                setAvai(avai => [...avai, item])
                            } else {
                                setUnavai(unavai => [...unavai, item])
                            }
                        }
                    });
                }
                setWaitingLoad(false)
            });

    },[])

    useEffect(() => {
        if (query === "") {
            setSearchFirst(false)
        }
        else {
            setItemsAvaiRender(
                avai.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                    || item.category.toLowerCase().includes(query.toLowerCase())
                )
            )
            setItemsUnavaiRender(
                unavai.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                    || item.category.toLowerCase().includes(query.toLowerCase())
                )
            )
            setSearchFirst(false)
        }
    }, [query])

    return (
        <div>
            {
                waitingLoad && 
                <body className="load">
                    <div className="waiting-load">
                        <span className="fa-solid fa-spinner rotate-around icon"></span>
                    </div>
                </body>
            }
            <div className='homepage-container'>
                <p className='homepage-title'><b>AVAILABLE DEVICE</b></p>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search..." autoComplete="off"
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />
                </div>

                <div className='homepage-item-container'>
                    <div className="homepage-card-container">
                        {!searchFirst ? 
                        avai.map((item) => {
                            return (
                                <AvaiItem item={item} key={item._id}/>
                            )
                        }):
                        itemsAvaiRender.map((item) => {
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
                        {!searchFirst ?
                        unavai.map((item) => {
                            return (
                                <UnavaiItem
                                    name={item.name}
                                    available={item.available}
                                    quantity={item.quantity}
                                    category={item.category}
                                    description={item.description}
                                    image={item.image}
                                    key={item._id}
                                />
                            )
                        }):
                        itemsUnavaiRender.map((item) => {
                            return (
                                <UnavaiItem
                                    name={item.name}
                                    available={item.available}
                                    quantity={item.quantity}
                                    category={item.category}
                                    description={item.description}
                                    image={item.image}
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
