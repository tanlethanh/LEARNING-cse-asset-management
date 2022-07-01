import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import '../../../styles/admin.item.css';
import convertValidName from '../../../utils/convertValidName';
import Alert from '../../alert';
import ConfirmPassword from '../../confirmPassword';
import { dataContext } from '../admin';
export default function Items({ items, setChangeItems, changeItems }) {

    // use context to get data from parent component (admin)
    const data = useContext(dataContext)
    const navigate = useNavigate()

    const [addItem, setAddItem] = useState(false)
    const [CantDelete, setCantDelete] = useState(false)
    const [acceptDelete, setAcceptDelete] = useState(false)
    const [change, setChange] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')


    // use for fragment
    const maxLengthOfFragment = 10
    const numOfFragment = Math.ceil(items.length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFracment] = useState(0)

    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFracment(currentFragment - 1)
    }

    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFracment(currentFragment + 1)
    }

    // set button
    const handleAddItemButton = () => {
        setAddItem(!addItem)
    }
    const handleDeleteClick = (index) => {
        if (items[index].available == items[index].quantity) {
            items[index].deleteChosen = !items[index].deleteChosen
            setCantDelete(false)
            setChange(!change)
        } else {
            setAlertMess("This item can't delete!")
            setCantDelete(true)
            setAlert(false)
            setAlert(true)
        }
    }
    const handleSubmit = () => {
        setAcceptDelete(!acceptDelete)
    }

    // navigate to detail of chosen item
    const openItemDetail = (item) => {
        navigate("../item/detail/" + item._id, { state: { item: item, orders: data.orders, users: data.users } })
    }

    // Component use for add item
    function AddNewItem() {
        // property of item
        const [name, setName] = useState("")
        const [quantity, setQuantity] = useState(0)
        const [category, setCategory] = useState("Dụng cụ")
        const [description, setDescription] = useState("")
        const [images, setImages] = useState([])

        // utils
        const [errorQuantity, setErrorQuantity] = useState("invalid")
        const [typeAlert, setTypeAlert] = useState("")
        const [alert, setAlert] = useState(false)
        const [alertMess, setAlertMess] = useState('')

        // confirm admin password
        const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

        const sendNewItem = (adminPassword) => {
            setAlert(false)

            let image
            if (images.length > 0) {
                image = images[0].data_url
            }

            Axios.post("http://localhost:8266/api/item", {
                name: name,
                quantity: quantity,
                category: category,
                description: description,
                image: image,
                adminPassword: adminPassword,
            })
                .then(response => {
                    setAlertMess("Add new item successfully!")
                    setTypeAlert("success")
                    setAlert(true)
                    setTimeout(() => {
                        setAddItem(false)
                        setChangeItems(!changeItems)
                    }, 1000)
                })
                .catch(error => {

                    if (error.response.status === 403) {
                        setAlertMess("Your password is incorrect!")
                    }
                    else if (error.response.status === 400) {
                        if (error.response.data.messages.split(" ")[0] === "E11000") {
                            setAlertMess("Please use another name!")
                        }
                        else {
                            setAlertMess("Add new item failure, bad request!")
                        }
                    }
                    else {
                        setAlertMess("Add new item failure, please check again!")
                    }

                    console.log(error)
                    setTypeAlert("error")
                    setAlert(true)
                    setTimeout(() => {
                        setOpenConfirmAdminPassword(false)
                    }, 1000)
                })
        }

        useEffect(() => {
            if (quantity > 0) {
                setErrorQuantity("valid")

            } else {
                setErrorQuantity("invalid")
            }
        }, [quantity])

        return (
            <div className='item_add_background'>
                {
                    <Alert
                        type={typeAlert}
                        message={alertMess}
                        alert={alert}
                        setAlert={setAlert}
                    />

                }
                {
                    openConfirmAdminPassword &&
                    <ConfirmPassword
                        setOpen={setOpenConfirmAdminPassword}
                        callback={sendNewItem}
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
                    <h1 className='item_add_title'>Add new item</h1>

                    <div className='item_add_body'>
                        <div className='item_add_body_left'>
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
                            <textarea className='input_body input_des' onChange={e => {
                                setDescription(e.target.value)
                            }} ></textarea>
                        </div>

                        {/* For adding image */}
                        <div className='item_add_body_right'>
                            <label className='lable_body'>Image</label>
                            <ImageUploading
                                value={images}
                                onChange={(imageList, addUpdateIndex) => {
                                    setImages(imageList)
                                }}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">
                                        <button
                                            style={isDragging ? { color: "red" } : null}
                                            onClick={onImageUpload}
                                            className={"upload_clickdrop " + ((images.length > 0) && "display_none")}
                                            {...dragProps}
                                        >
                                            Click or Drop here
                                        </button>
                                        &nbsp;
                                        {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                                        {imageList.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <img src={image.data_url} alt="" width="280" />
                                                <div className="image-item__btn-wrapper">
                                                    <button onClick={() => onImageUpdate(index)}>Change</button>
                                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ImageUploading>
                        </div>


                    </div>

                    <div className='item_add_footer'>
                        <button className='button' type="submit"
                            onClick={() => {
                                if (quantity <= 0) {
                                    setAlertMess("Quantity must be valid!")
                                    setTypeAlert("error")
                                    setAlert(false)
                                    setAlert(true)
                                } else {
                                    setOpenConfirmAdminPassword(true)
                                }
                            }}>Add now!</button>
                    </div>
                </div>

            </div>
        )
    }

    // Accept delete item
    function AcceptDeleteItem() {

        // utils
        const [typeAlert, setTypeAlert] = useState("")
        const [alert, setAlert] = useState(false)
        const [alertMess, setAlertMess] = useState('')

        const handleYes = (adminPassword) => {
            items.map((item, index) => {
                if (item.deleteChosen === true) {
                    Axios.delete(`http://localhost:8266/api/item/${item._id}`, {
                        adminPassword: adminPassword,
                    })
                        .then((response) => {
                            if (index === items.length - 1) {
                                setAlertMess("Delete items successfully!")
                                setTypeAlert("success")
                                setAlert(true)
                                setTimeout(() => {
                                    setChangeItems(!changeItems)
                                }, 1000)
                            }
                        })

                        .catch(error => {
        
                            if (error.response.status === 403) {
                                setAlertMess("Your password is incorrect!")
                            }
                            else if (error.response.status === 400) {
                                if (error.response.data.messages.split(" ")[0] === "E11000") {
                                    setAlertMess("Please use another name!")
                                }
                                else {
                                    setAlertMess("Add new item failure, bad request!")
                                }
                            }
                            else {
                                setAlertMess("Add new item failure, please check again!")
                            }
        
                            console.log(error)
                            setTypeAlert("error")
                            setAlert(true)
                            setTimeout(() => {
                                setAcceptDelete(false)
                            }, 1000)
                        })

                }
            })
        }

        return (
            <div className='item_delete_background'>
                {
                    <Alert
                        type={typeAlert}
                        message={alertMess}
                        alert={alert}
                        setAlert={setAlert}
                    />

                }
                {
                    <ConfirmPassword
                        setOpen={setAcceptDelete}
                        callback={handleYes}
                    />
                }
            </div>
        )
    }


    return (
        <div>
            <div className='item-top'>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search item" />
                </div>
                <button className='item_add_button' onClick={handleAddItemButton}>+</button>
                {addItem && <AddNewItem />}
            </div>

            <div className="list-item-title">
                <div className="list-item-col item_name_col">Name of item</div>
                <div className="list-item-col item_category_col">Category</div>
                <div className="list-item-col item_available_col">Available</div>
                <div className="list-item-col item_quantity_col">Quantity</div>
                <div className="list-item-col item_description_col">Description</div>
                <div className="list-item-col">Delete</div>
            </div>


            {
                items.map((item, index) => {
                    return (
                        (index >= currentFragment * maxLengthOfFragment && index < (currentFragment + 1) * maxLengthOfFragment)
                        && <div key={item._id} className={"list-item " + (index % 2 === 0 ? "list-item-odd" : "")}>
                            <div
                                className="list-item-col item_name_col"
                                onClick={() => { openItemDetail(item) }}
                            >
                                {item.name}
                            </div>
                            <div className="list-item-col item_category_col">{item.category}</div>
                            <div className="list-item-col item_available_col">{item.available}</div>
                            <div className="list-item-col item_quantity_col">{item.quantity}</div>
                            <div className="list-item-col item_description_col">{item.description}</div>
                            <div className="list-item-col ">
                                <i
                                    className={"fa-solid fa-trash-can " + (item.deleteChosen === true ? " item_delete_chosen" : "")}
                                    onClick={() => handleDeleteClick(index)}>
                                </i>
                            </div>
                            {CantDelete && <Alert
                                type="error"
                                message={alertMess}
                                alert={alert}
                                setAlert={setAlert}
                            />}
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
                {acceptDelete && <AcceptDeleteItem />}
            </div>

            <div className="list-end">
                <div id="previous-number">
                    <button className="move-list" onClick={prevFragment}>Previous</button>
                </div>
                {
                    [...Array(numOfFragment)].map((value, index) => {
                        return (
                            <div className="list-number ">
                                <button
                                    className={(currentFragment === index ? "chosen" : "")}
                                    onClick={() => {
                                        setCurrentFracment(index)
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