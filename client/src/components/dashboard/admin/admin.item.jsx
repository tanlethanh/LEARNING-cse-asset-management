import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import './admin.item.css'
export default function Items({ items, setChangeItems, changeItems }) {

    const [addItem, setAddItem] = useState(false)
    const [change, setChange] = useState(false)

    useEffect(()=>{

    }, [change])

    useEffect(()=>{

    }, [items])


    const handleAddItemButton = () => {
        setAddItem(!addItem)
    }

    const handleDeleteClick = (index) => {

        // 

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

    function AddNewItem() {
        const [name, setName] = useState("")
        const [quantity, setQuantity] = useState(0)
        const [category, setCategory] = useState("")
        const [description, setDescription] = useState("")

        const addNewItem = () => {
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

        return (
            <div className="item_add_container">

                <div className='item_add_form'>
                    <button
                        onClick={() => {
                            setAddItem(false);
                        }}
                    >
                        X
                    </button>
                    <h1>Add new item</h1>

                    <div className='item_add_body'>
                        <label>Name of item</label>
                        <input type="text" onChange={e => {
                            setName(e.target.value)
                        }} />

                        <label>Quantity</label>
                        <input type="number" onChange={e => {
                            setQuantity(e.target.value)
                        }} />

                        <label>Category</label>
                        <input type="text" onChange={e => {
                            setCategory(e.target.value)
                        }} />

                        <label>Description</label>
                        <textarea onChange={e => {
                            setDescription(e.target.value)
                        }} ></textarea>
                    </div>

                    <button type="submit" onClick={addNewItem}>Add now!</button>
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

            <div className="list-item list-item-title">
                <div className="list-item-col item-col-name">Name of item</div>
                <div className="list-item-col">Category</div>
                <div className="list-item-col">Available</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Description</div>
                <div className="list-item-col">Delete</div>
            </div>


            {
                items.map((item, index) => {
                    return (
                        <div key={item._id} className={"list-item " + (index % 2 === 0 ? "list-item-odd" : "")}>
                            <div className="list-item-col item-col-name">{item.name}</div>
                            <div className="list-item-col">{item.category}</div>
                            <div className="list-item-col">{item.available}</div>
                            <div className="list-item-col">{item.quantity}</div>
                            <div className="list-item-col">{item.description}</div>
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

            <div className="item_submit">
                <button
                    type="submit"
                    className="item_submit_button"
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