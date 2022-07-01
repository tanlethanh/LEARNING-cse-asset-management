import React from 'react';
import getFormattedDate from "../../../utils/formatDate"

export default function Returned(props) {
    return (
        <div>
            <div className="list-item list-item-title">
                <div className="list-item-col">Item</div>
                <div className="list-item-col">Category</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Return date</div>
            </div>

            {props.currentList.map((item, index) => (
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={item._id}>
                    <div className="list-item-col">{item.nameItem}</div>
                    <div className="list-item-col">{item.categoryItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(item.returnDate))}
                    </div>
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