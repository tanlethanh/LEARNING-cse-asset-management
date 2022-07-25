import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../../App'
import ListOfItem from './listOfItem';
import EditItemModal from './editItemModal';
import BlankPage from '../../helpers/blankPage';
import NotFoundPage from '../../helpers/notFoundPage';

export default function ItemById() {

    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const typeTab = searchParams.get("type")

    const { data, helpers, mainUser } = useContext(AppContext)

    // for data of item
    const [notFound, setNotFound] = useState(false)
    const [item, setItem] = useState({})
    const [isUpdated, setIsUpdated] = useState(false)
    const [currentBorrowerList, setCurrentBorrowerList] = useState([])
    const [oldBorrowerList, setOldBorrowerList] = useState([])
    const [borrowerList, setBorrowerList] = useState([])
    const [openEditItem, setOpenEditItem] = useState(false)

    useEffect(() => {
        helpers.setOpenLoading(true)

        Axios.get(`/api/item/${id}`)
            .then((response) => {
                setItem(response.data.item)
                helpers.setOpenLoading(false)
            })
            .catch((error) => {
                setNotFound(true)
                helpers.setOpenLoading(false)
            })

    }, [isUpdated])

    useEffect(() => {

        if (Object.keys(item).length === 0) return

        const idOrderList = []
        item.borrowerList.map(element => {
            idOrderList.push(element.idOrder)
        })

        const current = []
        const old = []
        const all = []

        data.orders.map(order => {
            if (order.status === "ok") current.push(order)
            else if (order.status === "done") old.push(order)
            all.push(order)
        })

        setCurrentBorrowerList(current)
        setOldBorrowerList(old)
        setBorrowerList(all)
    }, [data.orders, item])

    if (!mainUser.infor.isAdmin || notFound) return <NotFoundPage />

    if (Object.keys(item).length === 0) return <BlankPage />
    return (
        <div className="dashboard_container item_detail_container">

            {openEditItem &&
                <EditItemModal
                    item={item}
                    isUpdated={isUpdated}
                    setIsUpdated={setIsUpdated}
                    setOpenEditItem={setOpenEditItem}

                />
            }

            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {item.name}
                    </h1>
                    <h2 className="description">
                        {item.category}
                    </h2>
                </div>
                <div className="detail item_detail">

                    <ul className="list-infor">
                        <h3>
                            Information
                            <button
                                className="button-edit"
                                onClick={() => { setOpenEditItem(true) }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </h3>
                        <li className="item-infor">Name: {item.name}</li>
                        <li className="item-infor">Category: {item.category}</li>
                        <li className="item-infor">Available: {item.available}</li>
                        <li className="item-infor">Quantity: {item.quantity}</li>
                        <li className="item-infor">Description: {item.description}</li>
                    </ul>

                    <ul className="list-infor">
                        <h3>Statistics</h3>
                        <li className="item-infor">All orders: {item.borrowerList.length}</li>
                        <li className="item-infor">Current orders: {currentBorrowerList.length}</li>
                    </ul>

                </div>
            </div>

            <div id="content">
                <div id="menu">
                    <h1 className="menu_title" >LIST</h1>
                    <button
                        className={(typeTab === "current" || !typeTab) ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ type: "current" }) }}
                    >
                        Current borrower
                    </button>
                    <button
                        className={(typeTab === "done") ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ type: "done" }) }}
                    >
                        Old borrower
                    </button>
                    <button
                        className={(typeTab === "all") ? "menu_list chosen" : "menu_list"}
                        onClick={() => { setSearchParams({ type: "all" }) }}
                    >
                        All of borrower
                    </button>

                </div>

                {(typeTab === "current" || !typeTab) && <ListOfItem list={currentBorrowerList} />}
                {typeTab === "done" && <ListOfItem list={oldBorrowerList} />}
                {typeTab === "all" && <ListOfItem list={borrowerList} />}

            </div>


        </div>



    )
}