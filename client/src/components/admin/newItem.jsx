import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ImageUploading from "react-images-uploading";
import convertValidName from '../../utils/convertValidName';
import ConfirmPassword from '../../helpers/confirmPassword';
import { AppContext } from '../../App';

export default function NewItem({ setOpenAddItem }) {

    const { helpers, data } = useContext(AppContext)
    // property of item
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [category, setCategory] = useState("Dụng cụ")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])

    // utils
    const [errorQuantity, setErrorQuantity] = useState("invalid")

    // confirm admin password
    const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

    const sendNewItem = async (adminPassword) => {
        let image
        if (images.length > 0) {
            image = images[0].data_url
        }

        Axios.post("/api/item", {
            name: name,
            quantity: quantity,
            category: category,
            description: description,
            image: image,
            adminPassword: adminPassword,
        })
            .then(async (response) => {
                const res = await Axios.get('/api/item')
                if (res.data.items) {
                    data.setItems(res.data.items)
                }
                helpers.setOpenLoading(false)
                helpers.setAlert({
                    type: "success",
                    message: "Add new item successfully!"
                })
                helpers.setOpenAlert(true)
                setOpenAddItem(false)
            })
            .catch(error => {
                helpers.setOpenLoading(false)
                if (error.response.status === 403) {
                    helpers.setAlert({
                        type: "error",
                        message: "Your password is incorrect!"
                    })
                }
                else {
                    if (error.response.data.message.split(" ")[0] === "E11000") {
                        helpers.setAlert({
                            type: "error",
                            message: "The item name is existing in asset!"
                        })
                    }
                    else {
                        helpers.setAlert({
                            type: "error",
                            message: "Add new item failure, bad request!"
                        })
                    }
                }
                helpers.setOpenAlert(true)
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
                    callback={sendNewItem}
                />
            }
            <div className='item_add_container'>
                <div className='titleCloseBtn'>
                    <button
                        onClick={() => {
                            setOpenAddItem(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <h1 className='item_add_title'>Add new item</h1>

                <div className='item_add_body'>
                    <div className='item_add_body_left'>
                        <label className='label_body'>Name of item</label>
                        <input className='input_body' type="text" onChange={e => {
                            setName(convertValidName(e.target.value))
                        }} />

                        <label className='label_body'>Quantity</label>
                        <p className={"signup_input_" + errorQuantity}>
                            {(errorQuantity === 'valid') && "Quantity is valid!"}
                            {(errorQuantity === 'invalid') && "Quantity must be a positive number."}
                        </p>
                        <input className='input_body' type="number" onChange={e => {
                            setQuantity(e.target.value)
                        }} />

                        <label className='label_body'>Category</label>
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

                        <label className='label_body'>Description</label>
                        <textarea className='input_body input_des' onChange={e => {
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
                                helpers.setAlert({
                                    type: "error",
                                    message: "Quantity must be valid!"
                                })
                                helpers.setOpenAlert(true)
                            } else {
                                setOpenConfirmAdminPassword(true)
                            }
                        }}>Add now!</button>
                </div>
            </div>

        </div>
    )
}