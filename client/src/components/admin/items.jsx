import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import NewItem from './newItem'
import ConfirmPassword from '../../helpers/confirmPassword';
import Arrange, { arrangeList } from '../../helpers/arrange';
import getFormattedDate from '../../utils/formatDate';

export default function Items() {

    const navigate = useNavigate()
    const { data, helpers, mainUser } = useContext(AppContext)

    // for search
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })
    const [itemsRender, setItemsRender] = useState([])


    // utils
    const [addItem, setAddItem] = useState(false)
    const [acceptDelete, setAcceptDelete] = useState(false)
    const [change, setChange] = useState(false)

    // use for fragment
    const maxLengthOfFragment = 10
    const numOfFragment = Math.ceil(data.items.length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)

    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }

    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    // set button
    const handleAddItemButton = () => {
        setAddItem(true)
    }

    const handleDeleteClick = (index) => {
        if (itemsRender[index].available == itemsRender[index].quantity) {
            itemsRender[index].deleteChosen = !itemsRender[index].deleteChosen
            setChange(!change)
        } else {
            helpers.setAlert({
                type: "error",
                message: "This item is in progress!"
            })
            helpers.setOpenAlert(true)
        }
    }
    const handleSubmit = () => {
        setAcceptDelete(!acceptDelete)
    }

    // navigate to detail of chosen item
    const openItemDetail = (item) => {
        navigate("../item/" + item._id)
    }

    // Accept delete item
    function AcceptDeleteItem(props) {

        const handleYes = async (adminPassword) => {
            helpers.setOpenLoading(true)
            const res = await Axios.post(`/api/auth/login`, {
                password: adminPassword,
                email: mainUser.infor.email
            })

            if (res.data.user) {
                let countSuccess = 0
                const deleteList = itemsRender.filter(item => item.deleteChosen)
                deleteList.map((item, index) => {
                    Axios.delete(`/api/item/${item._id}`)
                        .then(async (response) => {
                            countSuccess++;
                            helpers.setAlert({
                                type: "success",
                                message: `Delete ${item.name} successfully!`
                            })
                            helpers.setOpenAlert(true)

                            if (index === deleteList.length - 1) {
                                if (countSuccess > 0) {
                                    const res = await Axios.get('/api/item')
                                    if (res.data.items) {
                                        data.setItems(res.data.items)
                                    }
                                }
                                helpers.setOpenLoading(false)
                            }

                        })
                        .catch(() => {
                            helpers.setAlert({
                                type: "error",
                                message: `Delete ${item.name} failure!`
                            })
                            helpers.setOpenAlert(true)
                        })
                })

                setAcceptDelete(false)
            }
            else {
                helpers.setOpenLoading(false)
                helpers.setAlert({
                    type: "error",
                    message: "Your password is incorrect!"
                })
                helpers.setOpenAlert(true)
            }
        }

        return (
            <ConfirmPassword
                setOpen={setAcceptDelete}
                callback={handleYes}
            />
        )
    }

    useEffect(() => {
        let type = "string"
        if (arrangeKey.column === "updatedAt") type = "date"
        else if (arrangeKey.column === "borrowerList") type = "array"
        if (query === "") {
            setItemsRender(arrangeList(data.items, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setItemsRender(
                arrangeList(
                    data.items.filter(item =>
                        item.name.toLowerCase().includes(query.toLowerCase())
                        || item.category.toLowerCase().includes(query.toLowerCase())
                        || item.description.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(item.updatedAt)).includes(query.toLowerCase())
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [data.items, query, arrangeKey])

    return (
        <div>
            {acceptDelete && <AcceptDeleteItem />}
            {addItem && <NewItem setOpenAddItem={setAddItem} />}
            <div className='item-top'>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search..." autoComplete="off"
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />
                </div>
                <button className='item_add_button' onClick={handleAddItemButton}>+</button>
                <p style={{ "marginLeft": "10px" }}>Add new item</p>
            </div>
            <p className='dashboard_guide'>
                Node: You can click on name of item to see and edit the detail of item
            </p>

            <div className="list-item list-item-title">
                <div className="list-item-col item_name_col" title="Nhấp vào tên item để biết thêm chi tiết về item">
                    Name of item
                    <Arrange type="name" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col item_category_col">
                    Category
                    <Arrange type="category" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col item_available_col">
                    Available
                </div>
                <div className="list-item-col item_orders_col">
                    Orders
                    <Arrange type="borrowerList" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />
                </div>
                <div className="list-item-col item_updatedDate_col">
                    Update day
                    <Arrange type="updatedAt" arrangeKey={arrangeKey} setArrangeKey={setArrangeKey} />

                </div>
                <div className="list-item-col item_description_col">Description</div>
                <div className="list-item-col item_delete_col">Delete</div>
            </div>


            {
                itemsRender.map((item, index) => {
                    return (
                        (index >= currentFragment * maxLengthOfFragment && index < (currentFragment + 1) * maxLengthOfFragment)
                        && <div key={item._id} className={"list-item " + (index % 2 === 0 ? "list-item-odd" : "")}>
                            <div
                                className="list-item-col item_name_col"
                                onClick={() => { openItemDetail(item) }}
                            >
                                <img src={item.image ? item.image : "./big_logo.png"} className="image-logo" alt="..." />
                                {item.name}
                            </div>
                            <div className="list-item-col item_category_col">
                                {item.category}
                            </div>
                            <div className="list-item-col item_available_col">
                                {item.available + "/" + item.quantity}
                            </div>
                            <div className="list-item-col item_orders_col">
                                {item.borrowerList.length}
                            </div>
                            <div className="list-item-col item_updatedDate_col">
                                {getFormattedDate(new Date(item.updatedAt))}
                            </div>
                            <div className="list-item-col item_description_col">
                                {item.description}
                            </div>
                            <div className="list-item-col item_delete_col">
                                <i
                                    className={"fa-solid fa-trash-can " + (item.deleteChosen === true ? " item_delete_chosen" : "")}
                                    onClick={() => handleDeleteClick(index)}>
                                </i>
                            </div>
                        </div>
                    )
                })
            }

            {itemsRender.length > 0 && <div className="submit_button_container">
                <button
                    type="submit"
                    className="submit_button"
                    onClick={handleSubmit}
                >
                    Submit
                </button>

            </div>}

            {numOfFragment > 1 &&
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
                </div>}
        </div>
    )
}