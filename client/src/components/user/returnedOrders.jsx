import React, { useState, useEffect } from 'react';
import getFormattedDate from '../../utils/formatDate';
import Arrange, { arrangeList } from '../../helpers/arrange';

export default function ReturnedOrders({ dataUser, orderList }) {

    const [ordersRender, setOrdersRender] = useState(orderList)

    // for search and arrange
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })

    useEffect(() => {

        let type = "string"
        if (arrangeKey.column === "createdAt" || arrangeKey.column === "updatedAt" || arrangeKey.column === "returnDate") {
            type = "date"
        }
        else if (arrangeKey.column === "quantity") {
            type = "number"
        }

        if (query === "") {
            setOrdersRender(arrangeList(orderList, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setOrdersRender(
                arrangeList(
                    orderList.filter(order =>
                        order.nameItem.toLowerCase().includes(query.toLowerCase())
                        || order.categoryItem.toLowerCase().includes(query.toLowerCase())
                        || order.status.toLowerCase().includes(query.toLowerCase())
                        || order.quantity.toString().includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.createdAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(order.returnDate)).includes(query.toLowerCase())
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [orderList, query, arrangeKey])


    // for fragment
    const [currentFragment, setCurrentFragment] = useState(0)
    const maxOfFragment = 10
    const numberOfFragment = Math.ceil(orderList.length * 1.0 / maxOfFragment)
    function prevFragment() {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }
    function nextFragment() {
        if (currentFragment < numberOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    return (
        <div className='returned_orders'>
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="Search item"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>
            <div className="list-item list-item-title">
                <div className="list-item-col user_name_col">
                    Item
                    <Arrange type="nameItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_category_col">
                    Category
                    <Arrange type="categoryItem" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_quantity_col">
                    Quantity
                    <Arrange type="quantity" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_createdAt_col">
                    Created at
                    <Arrange type="createdAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_confirmAt_col">
                    Confirm at
                    <Arrange type="updatedAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col user_returnDate_col">
                    Return date
                    <Arrange type="returnDate" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
            </div>

            {ordersRender.map((item, index) => (
                index >= currentFragment * maxOfFragment && index < (currentFragment + 1) * maxOfFragment
                &&
                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={item._id}>
                    <div className="list-item-col user_name_col">{item.nameItem}</div>
                    <div className="list-item-col user_category_col">{item.categoryItem}</div>
                    <div className="list-item-col user_quantity_col">{item.quantity}</div>
                    <div className="list-item-col user_createdAt_col">
                        {getFormattedDate(new Date(item.createdAt))}
                    </div>
                    <div className="list-item-col user_confirmAt_col">
                        {getFormattedDate(new Date(item.updatedAt))}
                    </div>
                    <div className="list-item-col user_returnDate_col">
                        {getFormattedDate(new Date(item.returnDate))}
                    </div>
                </div>
            ))}

            <div className="list-end">
                <div id="previous-number">
                    <button
                        className="move-list"
                        onClick={prevFragment}
                    >Previous</button>
                </div>
                {
                    [...Array(numberOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number" key={index}>
                                <button
                                    className={index === currentFragment ? "chosen" : ""}
                                    onClick={() => {
                                        setCurrentFragment(index)
                                    }}
                                >{index}</button>
                            </div>
                        )
                    })
                }

                <div id="next-number">
                    <button
                        className="move-list"
                        onClick={nextFragment}
                    >Next</button>
                </div>
            </div>
        </div>

    )
}