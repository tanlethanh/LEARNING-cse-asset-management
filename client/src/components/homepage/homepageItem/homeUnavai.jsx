import React, {} from "react";

export default function UnavaiItem(props) {
    return (
        <div className='homepage_card'>
            <div className='homepage_leftcard un-leftcard'>
                <img src="..." className="img-fluid rounded-start" alt="..." />
            </div>
            <div className='homepage_rightcard'>
                <p className='homepage_name'>{props.name}</p>
                <ul>
                    <li className='homepage_info'>Quantity: {props.available}/{props.quantity}</li>
                    <li className='homepage_info'>Category: {props.category}</li>
                    <li className='homepage_info' id='hp_des'>Des: {props.description}</li>
                </ul>
                <button className='homepage-un-button'>
                    REGISTER
                </button>
            </div>
        </div>           
    )
}