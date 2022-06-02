import React from 'react';
import '../member.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Borrow(props){
    return (
        <div>
            {props.currentList.map((item, index) => (
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col item-col-name">{item.nameItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">{item.updateAt}</div>
                </div>
            ))}
        </div>
        
    )
}
