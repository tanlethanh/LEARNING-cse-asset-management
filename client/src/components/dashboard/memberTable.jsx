import React from 'react';
import './member.css';

export default function Table(props){
    return (
        <div>
            {props.currentList.map((item) => (
                <div className="list-item list-item-odd">
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col item-col-name">{item.nameItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">{item.updateAt}</div>
                    <div className="list-item-col accept"><i class="fa-solid fa-download"></i></div>
                    <div className="list-item-col"><i class="accept_status">Accept</i></div>
                </div>
            ))}
        </div>
        
    )
}
