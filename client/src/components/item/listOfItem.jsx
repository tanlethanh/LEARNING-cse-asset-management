import React, { useEffect, useState } from 'react';
import getFormattedDate from '../../utils/formatDate';
import Arrange, { arrangeList } from '../../helpers/arrange';
import reverseName from '../../utils/reverseName';

export default function ListOfItem({ list }) {
    const [listRender, setListRender] = useState(list)

    // for search
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "returnDate",
        arrange: "inc"
    })

    // use for fragment
    const maxLengthOfFragment = 10
    let numOfFragment = Math.ceil(list.length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)

    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }

    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }


    useEffect(() => {
        let type = "string";
        if (
            arrangeKey.column === "updatedAt"
            || arrangeKey.column === "createdAt"
            || arrangeKey.column === "returnDate"
        ) {
            type = "date";
        }
        else if (arrangeKey.column === "quantity") type = "number"


        if (query === "") {
            setListRender(arrangeList(list, arrangeKey.column, type, arrangeKey.arrange));
        }
        else {
            setListRender(
                arrangeList(
                    list.filter(item => item.fullName.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(item.createdAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(item.updatedAt)).includes(query.toLowerCase())
                        || getFormattedDate(new Date(item.returnDate)).includes(query.toLowerCase())
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            );
        }
    }, [list, query, arrangeKey])

    return (
        <div id="list">
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search..." autoComplete="off"
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
            </div>

            <div className="list-content">
                <div className="list-item list-item-title">
                    <div className="list-item-col item_name_col">
                        Borrower
                        <Arrange type="nameUser" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col">
                        Quantity
                        <Arrange type="quantity" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col">
                        Created at
                        <Arrange type="createdAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col">
                        Updated at
                        <Arrange type="updatedAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                    <div className="list-item-col">
                        Return date
                        <Arrange type="returnDate" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                    </div>
                </div>
                {
                    listRender.map((order, index) => {

                        return (
                            (
                                index >= currentFragment * maxLengthOfFragment &&
                                index < (currentFragment + 1) * maxLengthOfFragment
                            ) &&
                            <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={index}>
                                <div className="list-item-col item_name_col">
                                    {reverseName(order.nameUser)}
                                </div>
                                <div className="list-item-col list_item_multiline">
                                    {order.quantity}
                                </div>
                                <div className="list-item-col list_item_multiline">
                                    {getFormattedDate(new Date(order.createdAt))}
                                </div>
                                <div className="list-item-col list_item_multiline">
                                    {getFormattedDate(new Date(order.updatedAt))}
                                </div>
                                <div className="list-item-col list_item_multiline">
                                    {getFormattedDate(new Date(order.returnDate))}
                                </div>
                            </div>
                        )


                    })
                }
            </div>

            <div className="list-end">
                <div id="previous-number">
                    <button className="move-list" onClick={prevFragment}>Previous</button>
                </div>
                {
                    [...Array(numOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number " key={index}>
                                <button
                                    className={(currentFragment === index ? "chosen" : "")}
                                    onClick={() => {
                                        setCurrentFragment(index)
                                    }}
                                >{index}</button>
                            </div>
                        )
                    })
                }
                <div id="next-number">
                    <button className="move-list" onClick={nextFragment}>Next</button>
                </div>
            </div>
        </div>

    )
}