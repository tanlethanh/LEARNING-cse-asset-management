import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../styles/admin.item.css';
import convertValidName from '../../../utils/convertValidName';
import Alert from '../../alert';

export default function Items({ items, setChangeItems, changeItems }) {

    const [addItem, setAddItem] = useState(false)
    const [change, setChange] = useState(false)

    // set button
    const handleAddItemButton = () => {
        setAddItem(!addItem)
    }
    const handleDeleteClick = (index) => {
        items[index].deleteChosen = !items[index].deleteChosen
        setChange(!change)
    }
    const handleSubmit = () => {
        items.map((item, index) => {
            if (item.deleteChosen === true) {
                Axios.delete("http://localhost:8266/api/item/" + item._id)
                    .then((response) => {
                        if (index === items.length - 1) {
                            setChangeItems(!changeItems)
                        }
                    })
            }
        })
    }

    // Component use for add item
    function AddNewItem() {
        const [name, setName] = useState("")
        const [quantity, setQuantity] = useState(0)
        const [category, setCategory] = useState("")
        const [description, setDescription] = useState("")

        const [errorQuantity, setErrorQuantity] = useState("invalid")

        const [alert, setAlert] = useState(false)
        const [alertMess, setAlertMess] = useState('')

        const addNewItem = () => {
            if (quantity <= 0) {
                setAlertMess("Quantity must be valid!")
                setAlert(false)
                setAlert(true)
            } else {
                Axios.post("http://localhost:8266/api/item", {
                    name: name,
                    quantity: quantity,
                    category: category,
                    description: description
                }).then(response => {
                    console.log("Add new item ", response.data)
                    setChangeItems(!changeItems)
                    setAddItem(false);
                })
            }
        }

        useEffect(() => {
            if (quantity > 0 ) {
                setErrorQuantity("valid")
    
            } else {
                setErrorQuantity("invalid")
            }
        }, [quantity])

        return (
            <div className='item_add_background'>
                {
                    <Alert
                        type="error"
                        message={alertMess}
                        alert={alert}
                        setAlert={setAlert}
                    />
                }
                <div className='item_add_container'>
                    <div className='titleCloseBtn'>
                        <button
                            onClick={() => {
                                setAddItem(false);
                            }}
                        >
                            X
                        </button>
                    </div>
                    <h1 className='item_add_title'>ADD NEW ITEM</h1>

                    <div className='item_add_body'>
                        <label className='lable_body'>Name of item</label>
                        <input className='input_body' type="text" onChange={e => {
                            setName(convertValidName(e.target.value))
                        }} />

                        <label className='lable_body'>Quantity</label>
                        <p className={"signup_input_" + errorQuantity}>
                            {(errorQuantity === 'valid') && "Quantity is valid!"}
                            {(errorQuantity === 'invalid') && "Quantity must be a positive number."}
                        </p>
                        <input className='input_body' type="number" onChange={e => {
                            setQuantity(e.target.value)
                        }} />

                        <label className='lable_body'>Category</label>
                        <select className='input_body' name="e" onChange={e => {
                            setCategory(e.target.value)
                        }} >
                            <option value="Dụng cụ">Dụng cụ</option>
                            <option value="Thiết bị điện">Thiết bị điện</option>
                            <option value="Phòng học">Phòng học</option>
                            <option value="Đồ sự kiện">Đồ sự kiện</option>
                            <option value="Trang phục">Trang phục</option>
                            <option value="Đồ dùng văn phòng">Đồ dùng văn phòng</option>
                        </select>

                        <label className='lable_body'>Description</label>
                        <textarea className='input_body' onChange={e => {
                            setDescription(e.target.value)
                        }} ></textarea>
                    </div>

                    <div className='item_add_footer'>
                        <button className='button' type="submit" onClick={addNewItem}>Add now!</button>
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className='scrollItem' id='scroll'>
            <div className="list-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search item" />
            </div>

            <div className='item_add'>
                Add new item
                <button className='item_add_button' onClick={handleAddItemButton}>+</button>
                {addItem && <AddNewItem />}
            </div>

            <div className="list-item-title">
                <div className="list-item-col item-col-name">Name of item</div>
                <div className="list-item-col">Category</div>
                <div className="list-item-col">Available</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col text_left">Description</div>
                <div className="list-item-col">Delete</div>
            </div>


            {
                items.map((item, index) => {
                    return (
                        <div key={item._id} className={"list-item " + (index % 2 === 0 ? "list-item-odd" : "")}>
                            <div 
                            className="list-item-col item-col-name"
                            onClick={() => {}}
                            >{item.name}</div>
                            <div className="list-item-col">{item.category}</div>
                            <div className="list-item-col">{item.available}</div>
                            <div className="list-item-col">{item.quantity}</div>
                            <div className="list-item-col text_left">{item.description}</div>
                            <div className="list-item-col">
                                <i
                                    className={"fa-solid fa-trash-can " + (item.deleteChosen === true ? " item_delete_chosen" : "")}
                                    onClick={() => handleDeleteClick(index)}>
                                </i>
                            </div>
                        </div>
                    )
                })
            }

            <div className="submit_button_container">
                <button
                    type="submit"
                    className="submit_button"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

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