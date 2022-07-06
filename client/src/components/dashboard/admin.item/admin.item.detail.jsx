import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import ConfirmPassword from '../../confirmPassword';
import ImageUploading from "react-images-uploading";
import Alert from '../../alert';
import convertValidName from '../../../utils/convertValidName';

export default function DetailItem() {
    const { state } = useLocation()
    const { item, orders, users } = state

    console.log(item.description)

    let ordersList = [...orders.pending, ...orders.ok, ...orders.complete]


    // use for menu list
    const tabs = ['current', 'done', 'all']
    const [currentTab, setCurrentTab] = useState('current')
    const [openEditItem, setOpenEditItem] = useState(false)

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

    function EditDetailItem() {
        // property of item
        const [name, setName] = useState(item.name)
        const [quantity, setQuantity] = useState(item.quantity)
        const [category, setCategory] = useState(item.category)
        const [description, setDescription] = useState(item.description)
        const [images, setImages] = useState([])

        // utils
        const [errorQuantity, setErrorQuantity] = useState("invalid")
        const [alert, setAlert] = useState(false)
        const [typeAlert, setTypeAlert] = useState("")
        const [alertMess, setAlertMess] = useState('')

        // confirm admin password
        const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

        const EditItem = (adminPassword) => {
            setAlert(false)

            let image = item.image
            if (images.length > 0) {
                image = images[0].data_url
            }

            Axios.patch(`http://localhost:8266/api/item/${item._id}`, {
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
                        setOpenEditItem(false)
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
                        callback={EditItem}
                    />
                }
                <div className='item_add_container'>

                    <h1 className='item_add_title'>Edit detail item</h1>

                    <div className='item_add_body'>
                        <div className='item_add_body_left'>
                            <label className='lable_body'>Name of item</label>
                            <input className='input_body' type="text" placeholder={item.name} onChange={e => {
                                setName(convertValidName(e.target.value))
                            }} />

                            <label className='lable_body'>Quantity</label>
                            <p className={"signup_input_" + errorQuantity}>
                                {(errorQuantity === 'valid') && "Quantity is valid!"}
                                {(errorQuantity === 'invalid') && "Quantity must be a positive number."}
                            </p>
                            <input className='input_body' type="number" placeholder={item.quantity} onChange={e => {
                                setQuantity(e.target.value)
                            }} />

                            <label className='lable_body'>Category</label>
                            <select className='input_body' name="e" onChange={e => {
                                setCategory(e.target.value)
                            }} >
                                {item.category == "Dụng cụ" ?
                                    <option value="Dụng cụ" selected>Dụng cụ</option> :
                                    <option value="Dụng cụ">Dụng cụ</option>}
                                {item.category == "Thiết bị điện" ?
                                    <option value="Thiết bị điện" selected>Thiết bị điện</option> :
                                    <option value="Thiết bị điện">Thiết bị điện</option>}
                                {item.category == "Phòng học" ?
                                    <option value="Phòng học" selected>Phòng học</option> :
                                    <option value="Phòng học">Phòng học</option>}
                                {item.category == "Đồ sự kiện" ?
                                    <option value="Đồ sự kiện" selected>Đồ sự kiện</option> :
                                    <option value="Đồ sự kiện">Đồ sự kiện</option>}
                                {item.category == "Trang phục" ?
                                    <option value="Trang phục" selected>Trang phục</option> :
                                    <option value="Trang phục">Trang phục</option>}
                                {item.category == "Đồ dùng văn phòng" ?
                                    <option value="Đồ dùng văn phòng" selected>Đồ dùng văn phòng</option> :
                                    <option value="Đồ dùng văn phòng">Đồ dùng văn phòng</option>}
                            </select>

                            <label className='lable_body'>Description</label>
                            <textarea className='input_body input_des' placeholder={item.description} onChange={e => {
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
                                    <React.Fragment>
                                        {item.image ?
                                            <div className="upload__image-wrapper">

                                                <img className={((images.length > 0) && "display_none")} src={item.image} alt="" width="280" />
                                                <div className="image-item__btn-wrapper">
                                                    <button
                                                        style={isDragging ? { color: "red" } : null}
                                                        onClick={onImageUpload}
                                                        className={((images.length > 0) && "display_none")}
                                                        {...dragProps}
                                                    >
                                                        Change
                                                    </button>
                                                </div>
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
                                            </div> :
                                            <div className="upload__image-wrapper">
                                                <button
                                                    style={isDragging ? { color: "red" } : null}
                                                    onClick={onImageUpload}
                                                    className={"upload_clickdrop " + ((images.length > 0) && "display_none")}
                                                    {...dragProps}
                                                >
                                                    Click or Drop here
                                                </button>
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
                                        }
                                    </React.Fragment>
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
                            }}>
                            Edit
                        </button>

                        <button
                            onClick={() => {
                                setOpenEditItem(false);
                            }}
                        >
                            Cancel
                        </button>

                    </div>
                </div>

            </div>
        )
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
                        <h3>
                            Information
                            <button
                                className="button-edit"
                                onClick={() => { setOpenEditItem(true) }}>
                                <i class="fa-solid fa-pen-to-square"></i>
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
                        <li className="item-infor">Current orders: {pending.length}</li>
                    </ul>

                </div>
            </div>

            {openEditItem && <EditDetailItem />}

            <div id="content">
                <div id="menu">
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
        </div>



    )
}