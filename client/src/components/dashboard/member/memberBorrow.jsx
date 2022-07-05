import React from 'react';
import getFormattedDate from "../../../utils/formatDate"

export default function Borrow(props) {
    return (
        <div>
            <div className="list-item list-item-title">
                <div className="list-item-col item_name_col">Item</div>
                <div className="list-item-col item_category_col">Category</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Accept date</div>
                <div className="list-item-col">Return date</div>
            </div>

            {props.currentList.map((item, index) => (
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={item._id}>
                    <div className="list-item-col item_name_col">{item.nameItem}</div>
                    <div className="list-item-col item_category_col">{item.categoryItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(item.updatedAt))}
                    </div>
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
