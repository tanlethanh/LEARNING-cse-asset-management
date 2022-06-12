import React, {} from "react";

export default function UnavaiItem(props) {
    return (
        <div className='homepage_card'>
            <div className='homepage_leftcard un-leftcard'>
                <img src="..." className="img-fluid rounded-start" alt="..." />
            </div>
            <div className='homepage_rightcard'>
                <p className='homepage_name'>{props.name}</p>
                <ul className="homepage_info">
                    <li>Quantity: {props.available}/{props.quantity}</li>
                    <li>Category: {props.category}</li>
                    <li>Des: {props.description}</li>
                </ul>
                <button className='homepage-un-button'>
                    REGISTER
                </button>
            </div>
        </div>           
    )
}