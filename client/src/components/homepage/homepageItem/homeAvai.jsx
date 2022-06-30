import React, { useState } from "react";
import '../../../styles/homepage.css';

export default function AvaiItem({item, handleRegister, handleRemove, isPicked}) {

    return (
        <div className='homepage_card'>
            <div className='homepage_leftcard'>
                <img src={item.image ? item.image : ""} className="homepage_image img-fluid rounded-start" alt="..." />
            </div>
            <div className='homepage_rightcard'>
                <p className='homepage_name'>{item.name}</p>
                <ul className="homepage_info">
                    <li>Quantity: {item.available}/{item.quantity}</li>
                    <li>Category: {item.category}</li>
                    <li>Des: {item.description}</li>
                </ul>

                {
                    !isPicked ?
                        <button className='homepage_reg' onClick={() => { handleRegister(item) }}>
                            REGISTER
                        </button> :
                        <button className='homepage_added' onClick={() => { handleRemove(item) }}>
                            ADDED
                        </button>
                }

            </div>
        </div>
    )
}
