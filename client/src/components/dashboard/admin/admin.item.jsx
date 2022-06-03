import React from 'react';

export default function Items(props) {
    console.log(props.items)
    return (
        <div>
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search item" />
            </div>

            
            
            <div className="list-item list-item-title">
                <div className="list-item-col item-col-name">Name of item</div>
                <div className="list-item-col">Category</div>
                <div className="list-item-col">Available</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Description</div>
                <div className="list-item-col">Detail</div>
            </div>


            {
                props.items.map((item, index) => {
                    return (
                        <div key={item._id} className={"list-item " + (index % 2 === 0 && "list-item-odd")}>
                            <div className="list-item-col item-col-name">{item.name}</div>
                            <div className="list-item-col">{item.category}</div>
                            <div className="list-item-col">{item.available}</div>
                            <div className="list-item-col">{item.quantity}</div>
                            <div className="list-item-col">{item.description}</div>
                            <div className="list-item-col">Detail</div>
                        </div>
                    )
                })
            }

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