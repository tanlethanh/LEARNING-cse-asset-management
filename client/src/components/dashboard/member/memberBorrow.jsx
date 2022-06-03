import React from 'react';
import '../member.css';

export default function Borrow(props){
    const setTime = (date) => {
        var e = new Date(date);
        return (e.getDate()-1) + '/' + (e.getMonth()+1) + '/' + e.getFullYear();
    }

    return (
        <div>
            <div class="list-item list-item-title">
                <div class="list-item-col">Category</div>
                <div class="list-item-col item-col-name">Item</div>
                <div class="list-item-col">Quantity</div>
                <div class="list-item-col">Date</div>
                <div class="list-item-col">Return date</div>
            </div>

            {props.currentList.map((item, index) => (
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col item-col-name">{item.nameItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">{setTime(item.updatedAt)}</div>
                    <div className="list-item-col">{setTime(item.returndAt)}</div>
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
