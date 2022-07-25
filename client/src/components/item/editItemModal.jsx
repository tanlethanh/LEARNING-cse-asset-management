import React, { useEffect, useState, useContext } from 'react';
import ImageUploading from "react-images-uploading";
import ConfirmPassword from '../../helpers/confirmPassword';
import convertValidName from '../../utils/convertValidName';
import Axios from 'axios'
import { AppContext } from '../../App';

export default function EditItemModal({
    item,
    isUpdated,
    setIsUpdated,
    setOpenEditItem,
}) {

    const { helpers } = useContext(AppContext)

    // property of item
    const [name, setName] = useState(item.name)
    const [quantity, setQuantity] = useState(item.quantity)
    const [category, setCategory] = useState(item.category)
    const [description, setDescription] = useState(item.description)
    const [images, setImages] = useState([])

    // utils
    const [errorQuantity, setErrorQuantity] = useState("invalid")

    // confirm admin password
    const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

    const EditItem = (adminPassword) => {

        let image = item.image
        if (images.length > 0) {
            image = images[0].data_url
        }

        helpers.setOpenLoading(true)
        Axios.patch(`/api/item/${item._id}`, {
            name: name,
            quantity: quantity,
            category: category,
            description: description,
            image: image,
            adminPassword: adminPassword,
        })
            .then(response => {
                helpers.setOpenLoading(false)
                setIsUpdated(!isUpdated)
                setOpenEditItem(false)
                helpers.setAlert({
                    type: "success",
                    message: "Edit item successfully!"
                })
                helpers.setOpenAlert(true)
            })
            .catch(error => {
                helpers.setOpenLoading(false)
                if (error.response.status === 403) {
                    helpers.setAlert({
                        type: "error",
                        message: "Your password is incorrect!"
                    })
                    helpers.setOpenAlert(true)
                }
                else if (
                    error.response.status === 400
                    || error.response.data.message.split(" ")[0] === "E11000"
                ) {
                    helpers.setAlert({
                        type: "error",
                        message: "Please use another name!"
                    })
                    helpers.setOpenAlert(true)
                }
                else {
                    helpers.setAlert({
                        type: "error",
                        message: error.response.data.message
                    })
                    helpers.setOpenAlert(true)
                }

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
                        <label className='label_body'>Name of item</label>
                        <input className='input_body' type="text" placeholder={item.name} onChange={e => {
                            setName(convertValidName(e.target.value))
                        }} />

                        <label className='label_body'>Quantity</label>
                        <p className={"signup_input_" + errorQuantity}>
                            {(errorQuantity === 'valid') && "Quantity is valid!"}
                            {(errorQuantity === 'invalid') && "Quantity must be a positive number."}
                        </p>
                        <input className='input_body' type="number" placeholder={item.quantity} onChange={e => {
                            setQuantity(e.target.value)
                        }} />

                        <label className='label_body'>Category</label>
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

                        <label className='label_body'>Description</label>
                        <textarea className='input_body input_des' placeholder={item.description} onChange={e => {
                            setDescription(e.target.value)
                        }} ></textarea>
                    </div>

                    {/* For adding image */}
                    <div className='item_add_body_right'>
                        <label className='label_body'>Image</label>
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

                                            <img
                                                className={((images.length > 0) && "display_none")}
                                                src={item.image}
                                                alt=""
                                                width="280"
                                            />
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
                                helpers.setAlert({
                                    type: "error",
                                    message: "Quantity must be valid!"
                                })
                                helpers.setOpenAlert(true)
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