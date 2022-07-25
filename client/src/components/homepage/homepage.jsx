import React, { useState, useEffect, useContext } from 'react';
import AvaiItem from './homepageItem/homeAvai';
import UnavaiItem from './homepageItem/homeUnavai';
import '../../styles/homepage.css';
import { AppContext } from '../../App';

export default function Homepage() {

    const [avai, setAvai] = useState([])
    const [unavai, setUnavai] = useState([])

    const { data } = useContext(AppContext)

    //search
    const [query, setQuery] = useState("")
    const [unavaiRender, setUnavaiRender] = useState([])
    const [avaiRender, setAvaiRender] = useState([])

    useEffect(() => {
        const avaiItems = []
        const unavaiItems = []
        data.items.map(item => {
            if (item.available != 0) {
                avaiItems.push(item)
            }
            else {
                unavaiItems.push(item)
            }
        })

        setAvai(avaiItems)
        setUnavai(unavaiItems)


    }, [data.items])

    useEffect(() => {
        if (query === "") {
            setAvaiRender(avai)
            setUnavaiRender(unavai)
        }
        else {
            setAvaiRender(
                avai.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                    || item.category.toLowerCase().includes(query.toLowerCase())
                )
            )
            setUnavaiRender(
                unavai.filter(item =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                    || item.category.toLowerCase().includes(query.toLowerCase())
                )
            )
        }
    }, [query, avai, unavai])

    return (
        <div>
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
                        {avaiRender.map((item) => {
                            return (
                                <AvaiItem item={item} key={item._id} />
                            )
                        })}
                    </div>
                </div>

                <hr className='homepage-line'></hr>

                {unavaiRender.length > 0 && <p className='homepage-title un-title'>UNAVAILABLE DEVICE</p>}

                <div className='homepage-item-container'>
                    <div className="homepage-card-container">
                        {unavaiRender.map((item) => {
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
