import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

export default function DetailItem() {
    const { state } = useLocation()
    const { item, orders, users } = state

    let ordersList = [...orders.pending, ...orders.ok, ...orders.complete]


    // use for menu list
    const tabs = ['current', 'done', 'all']
    const [currentTab, setCurrentTab] = useState('current')

    const navigate = useNavigate()

    // main state
    const [pending, setPending] = useState([])  // store list of obj (contain userid and orderid) of pending order
    const [done, setDone] = useState([])        // store list of obj (contain userid and orderid) of done order
    const [curBorrowers, setCurBorrowers] = useState([])
    const [oldBorrowers, setOldBorrowers] = useState([])
    const [allBorrowers, setAllBorrowers] = useState([])
    let chosenBorrowers = []        // store infor of chosen users, it can be current, old users or all of users
    let chosenList = []

    useEffect(() => {
        setPending(item.borrowerList.filter(element => element.status === 'pending'))
        setDone(item.borrowerList.filter(element => element.status === 'done'))

        // get unique users
        const uniqueUserId = [...new Set(item.borrowerList.map(element => element.idUser))]
        const uniqueUser = users.filter(element => uniqueUserId.includes(element._id))
        setAllBorrowers(uniqueUser)

    }, [])

    useEffect(() => {

        const uniqueUserId = [...new Set(pending.map(element => element.idUser))]
        const uniqueUser = users.filter(element => uniqueUserId.includes(element._id))
        setCurBorrowers(uniqueUser)

    }, [pending])

    useEffect(() => {
        const uniqueUserId = [...new Set(done.map(element => element.idUser))]
        const uniqueUser = users.filter(element => uniqueUserId.includes(element._id))
        setOldBorrowers(uniqueUser)

    }, [done])


    const goBack = () => {
        navigate("../dashboard", { replace: true })
    }

    if (currentTab === 'current') {
        chosenBorrowers = curBorrowers
        chosenList = pending
    }
    else if (currentTab === 'done') {
        chosenBorrowers = oldBorrowers
        chosenList = done
    }
    else if (currentTab === 'all') {
        chosenBorrowers = allBorrowers
        chosenList = item.borrowerList
    }

    return (
        <div className="dashboard_container">
            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {item.name}
                    </h1>
                    <h2 className="description">
                        {item.description}
                    </h2>
                    <button className="button-info" onClick={goBack}>Go back</button>
                </div>
                <div className="detail item_detail">

                    <ul className="list-infor">
                        <h3>Information</h3>
                        <li className="item-infor">Name: {item.name}</li>
                        <li className="item-infor">Category: {item.category}</li>
                        <li className="item-infor">Available: {item.available}</li>
                        <li className="item-infor">Quantity: {item.quantity}</li>
                        <li className="item-infor">Description: {item.description}</li>
                    </ul>
                    <ul className="list-infor">
                        <h3>Statistics</h3>
                        <li className="item-infor">All orders: {item.borrowerList.length}</li>
                        <li className="item-infor">Current orders: {pending.length}</li>
                    </ul>

                </div>
            </div>


            <div className="menu">
                <h1 className="menu_title" >LIST</h1>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={currentTab === tab ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setCurrentTab(tab) }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div id="list">
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>

                <div className="list-content">
                    <div className="list-item list-item-title">
                        <div className="list-item-col">Borrower</div>
                        <div className="list-item-col list_item_multiline">Quantity</div>
                        <div className="list-item-col list_item_multiline">Created date</div>
                        <div className="list-item-col list_item_multiline">Acceped date</div>
                        <div className="list-item-col">Return date</div>
                    </div>
                    {
                        chosenBorrowers.map((borrower, index) => {
                            const orderIdOfBorrower = chosenList
                                .filter(element => element.idUser === borrower._id)
                                .map(element => element.idOrder)
                            const inforOders = ordersList.filter(order => {
                                return orderIdOfBorrower.includes(order._id)
                            })
                            console.log(inforOders)


                            return (
                                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={borrower._id}>
                                    <div className="list-item-col">{borrower.fullName}</div>
                                    <div className="list-item-col list_item_multiline">
                                        {
                                            inforOders.map(order => {
                                                return (
                                                    <div key={order._id}>
                                                        {order.quantity}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="list-item-col list_item_multiline">
                                        {
                                            inforOders.map(order => {
                                                return (
                                                    <div key={order._id}>
                                                        {order.createdAt.substring(0, order.createdAt.indexOf('T'))}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="list-item-col list_item_multiline">
                                        {
                                            inforOders.map(order => {
                                                return (
                                                    <div key={order._id}>
                                                        {order.updatedAt.substring(0, order.updatedAt.indexOf('T'))}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="list-item-col list_item_multiline">
                                        {
                                            inforOders.map(order => {
                                                return (
                                                    <div key={order._id}>
                                                        {order.returnDate.substring(0, order.returnDate.indexOf('T'))}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>



            </div>
        </div>
    )
}