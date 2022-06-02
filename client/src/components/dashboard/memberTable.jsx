import React from 'react';
import './member.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Table(props){
    return (
        <div>
            {props.currentList.map((item, index) => (
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col item-col-name">{item.nameItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">{item.updateAt}</div>
                    {item.status == "ok" &&
                        <div className="list-item-col accept"><FontAwesomeIcon icon="fa-solid fa-arrow-down-to-bracket" />i</div>}
                    {item.status == "ok" &&
                        <div className="list-item-col"><i class="accept_status">Accept</i></div>}
                    {item.status == "pending" &&
                        <div className="list-item-col"><FontAwesomeIcon icon="fa-solid fa-arrow-down-to-bracket" />i</div> }
                    {item.status == "pending" &&
                        <div className="list-item-col"><i class="accept_status">Processing</i></div>}
                    {item.status == "denined" &&
                        <div className="list-item-col"><FontAwesomeIcon icon="fa-solid fa-arrow-down-to-bracket" />i</div> &&
                        <div className="list-item-col"><i class="accept_status">Canceled</i></div>}
                </div>
            ))}
        </div>
        
    )
}
