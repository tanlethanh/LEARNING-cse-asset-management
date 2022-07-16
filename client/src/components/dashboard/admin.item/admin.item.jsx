import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import '../../../styles/admin.item.css';
import '../../../styles/waiting.css';
import convertValidName from '../../../utils/convertValidName';
import Alert from '../../../helpers/alert';
import ConfirmPassword from '../../../helpers/confirmPassword';
import { dataContext } from '../admin';
import getFormattedDate from '../../../utils/formatDate';
import Arrange, { arrangeList } from '../../../helpers/arrange';

export default function Items({ admin, items, setChangeItems, changeItems }) {

    // for search
    const [query, setQuery] = useState("")
    const [arrangeKey, setArrangeKey] = useState({
        column: "updatedAt",
        arrange: "dec"
    })
    const [itemsRender, setItemsRender] = useState([])

    // use context to get data from parent component (admin)
    const data = useContext(dataContext)
    const navigate = useNavigate()

    // utils
    const [addItem, setAddItem] = useState(false)
    const [CantDelete, setCantDelete] = useState(false)
    const [acceptDelete, setAcceptDelete] = useState(false)
    const [change, setChange] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMess, setAlertMess] = useState('')
    const [waitingLoad, setWaitingLoad] = useState(false)

    // use for fragment
    const maxLengthOfFragment = 10
    const numOfFragment = Math.ceil(items.length * 1.0 / maxLengthOfFragment)
    const [currentFragment, setCurrentFragment] = useState(0)

    const prevFragment = () => {
        if (currentFragment > 0) setCurrentFragment(currentFragment - 1)
    }

    const nextFragment = () => {
        if (currentFragment < numOfFragment - 1) setCurrentFragment(currentFragment + 1)
    }

    useEffect(() => {
        let type = "string"
        if (arrangeKey.column === "updatedAt") type = "date"
        else if (arrangeKey.column === "borrowerList") type = "array"
        if (query === "") {
            setItemsRender(arrangeList(items, arrangeKey.column, type, arrangeKey.arrange))
        }
        else {
            setItemsRender(
                arrangeList(
                    items.filter(item =>
                        item.name.toLowerCase().includes(query.toLowerCase())
                        || item.category.toLowerCase().includes(query.toLowerCase())
                        || item.description.toLowerCase().includes(query.toLowerCase())
                        || getFormattedDate(new Date(item.updatedAt)).includes(query.toLowerCase())
                    ), arrangeKey.column, type, arrangeKey.arrange
                )
            )
        }
    }, [items, query, arrangeKey])

    // set button
    const handleAddItemButton = () => {
        setAddItem(!addItem)
    }

    const handleDeleteClick = (index) => {
        if (itemsRender[index].available == itemsRender[index].quantity) {
            itemsRender[index].deleteChosen = !itemsRender[index].deleteChosen
            setCantDelete(false)
            setChange(!change)
        } else {
            setAlertMess("This item can't be deleted!")
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
        const [alert, setAlert] = useState(false)
        const [typeAlert, setTypeAlert] = useState("")
        const [alertMess, setAlertMess] = useState('')

        // confirm admin password
        const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

        const sendNewItem = (adminPassword) => {
            setAlert(false)

            let image
            if (images.length > 0) {
                image = images[0].data_url
            }

            setWaitingLoad(true)
            Axios.post("/api/item", {
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
                    setWaitingLoad(false)
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

                    setTypeAlert("error")
                    setAlert(true)
                    setTimeout(() => {
                        setOpenConfirmAdminPassword(false)
                    }, 1000)
                    setWaitingLoad(false)
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
                    waitingLoad && 
                    <div className="load">
                        <div className="waiting-load">
                            <span className="fa-solid fa-spinner rotate-around icon"></span>
                        </div>
                    </div>
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
    function AcceptDeleteItem(props) {
        // utils
        const [typeAlert, setTypeAlert] = useState("")
        const [alert, setAlert] = useState(false)
        const [alertMess, setAlertMess] = useState('')

        const handleYes = (adminPassword) => {
            setWaitingLoad(true)
            Axios.post(`/api/auth/login`, {
                password: adminPassword,
                email: admin.email
            })
                .then(response => {
                    if (response.data.user) {
                        itemsRender.map((item, index) => {
                            if (item.deleteChosen === true) {
                                setWaitingLoad(true)
                                Axios.delete(`/api/item/${item._id}`)
                                    .then((response) => {
                                        if (index === items.length - 1) {
                                            setAlertMess("Delete items successfully!")
                                            setTypeAlert("success")
                                            setAlert(true)
                                            setTimeout(() => {
                                                setAcceptDelete(false)
                                                setChangeItems(!changeItems)
                                            }, 1000)
                                        }
                                        setWaitingLoad(false)
                                    })
                            }
                        })
                    } else {
                        setAlertMess("Your password is incorrect!")
                        setTypeAlert("error")
                        setAlert(true)
                        setTimeout(() => {
                            setAcceptDelete(false)
                        }, 1000)
                        setWaitingLoad(false)
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
                {
                    waitingLoad && 
                    <div className="load">
                        <div className="waiting-load">
                            <span className="fa-solid fa-spinner rotate-around icon"></span>
                        </div>
                    </div>
                }
            </div>
        )
    }

    return (
        <div>
            <div className='item-top'>
                <div className="list-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search..." autoComplete="off"
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />
                </div>
                <button className='item_add_button' onClick={handleAddItemButton} title="Nhấp vào đây để thêm item">+</button>
                <p style={{ "marginLeft": "10px" }}>Add new item</p>
                {addItem && <AddNewItem />}
            </div>
            <p className='dashboard_guide'>Node: You can click on name of item to see and edit the detail of item</p>

            <div className="list-item-title">
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