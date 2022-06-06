import React, {} from "react";

export default function UnavaiItem(props) {
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