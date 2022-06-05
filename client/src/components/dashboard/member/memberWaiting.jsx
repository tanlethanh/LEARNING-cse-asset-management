import React, {useState, useEffect } from 'react';
import '../member.css';


export default function Waiting(props){
    return (
        <div>
            <div class="list-item list-item-title">
                <div class="list-item-col">Category</div>
                <div class="list-item-col item-col-name">Item</div>
                <div class="list-item-col">Quantity</div>
                <div class="list-item-col">Date</div>
                <div class="list-item-col">Permission</div>
                <div class="list-item-col">Status</div>
            </div>

            {props.currentList.map((item, index) => (
                
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col item-col-name">{item.nameItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">
                        {item.createdAt.substring(0, item.createdAt.indexOf('T'))}
                    </div>
                    {item.status == "ok" &&
                        <div className="list-item-col accept"><i class="fa-solid fa-download"></i></div>}
                    {item.status == "ok" &&
                        <div className="list-item-col"><i class="accept_status">Accept</i></div>}
                    {item.status == "pending" &&
                        <div className="list-item-col "><i class="fa-solid fa-download"></i></div> }
                    {item.status == "pending" &&
                        <div className="list-item-col"><i class="pending_status">Process</i></div>}
                    {item.status == "denied" &&
                        <div className="list-item-col"><i class="fa-solid fa-download"></i></div>}
                    {item.status == "denied" &&  
                        <div className="list-item-col"><i class="denied_status">Denied</i></div>}
                </div>
            ))}

            <div className="list-end">
                <div id="previous-number"><button className="move-list">Previous</button></div>
                <div className="list-number"><button className="chosen">1</button></div>
                <div className="list-number"><button>2</button></div>
                <div className="list-number"><button>3</button></div>
                <div id="next-number"><button className="move-list">Next</button></div>
            </div>
        </div>
        
    )
}
