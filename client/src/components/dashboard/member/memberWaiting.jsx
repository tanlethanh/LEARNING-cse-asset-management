import React, { useState } from 'react';
import Axios from 'axios';
import OrderPDF from '../../orderPDF';
import getFormattedDate from "../../../utils/formatDate"
import ConfirmNext from '../../confirmNext';
import Alert from '../../alert';

export default function Waiting(props) {

    const [openConfirmNext, setOpenConfirmNext] = useState(false)
    const [alert, setAlert] = useState(false)
    const [typeAlert, setTypeAlert] = useState("")
    const [alertMess, setAlertMess] = useState('')
    const [idDeleteOrder, setIdDeleteOrder] = useState('')
    
    const handleBanClick = (orderId) => {
        setOpenConfirmNext(true)
        setIdDeleteOrder(orderId)
    }

    const banPendingOrder = async () => {

        Axios.delete(`http://localhost:8266/api/order/${idDeleteOrder}`, {
        })
            .then(response => {
                setAlertMess("Cancel order successfully!")
                setTypeAlert("success")
                setAlert(true)
                setTimeout(() => {
                    // setAddItem(false)
                }, 1000)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    setAlertMess("Your password is incorrect!")
                }
                else if (error.response.status === 400) {
                    setAlertMess(error.response.data.messages)
                }
                else {
                    setAlertMess("Cancel order failure, please check again!")
                }

                setTypeAlert("error")
                setAlert(true)
                setTimeout(() => {
                    setOpenConfirmNext(false)
                }, 1000)
            })

    }

    return (
        <div>
            {
                <Alert
                    type={typeAlert}
                    message={alertMess}
                    alert={alert}
                    setAlert={setAlert}
                />

            }
            {openConfirmNext &&
                <ConfirmNext
                    setOpen={setOpenConfirmNext}
                    callback={banPendingOrder}
                    message={"Are you sure to cancel this order?"}
                />}
            <div className="list-item list-item-title">
                <div className="list-item-col item_name_col">Item</div>
                <div className="list-item-col item_category_col">Category</div>
                <div className="list-item-col">Quantity</div>
                <div className="list-item-col">Return date</div>
                <div className="list-item-col">Permission</div>
                <div className="list-item-col">Status</div>
            </div>

            {props.currentList.map((item, index) => (

                <div className={"list-item " + (index % 2 === 0 && "list-item-odd")} key={item._id}>
                    <div className="list-item-col item_name_col">{item.nameItem}</div>
                    <div className="list-item-col item_category_col">{item.categoryItem}</div>
                    <div className="list-item-col">{item.quantity}</div>
                    <div className="list-item-col">
                        {getFormattedDate(new Date(item.returnDate))}
                    </div>
                    {item.status === "ok" &&
                        <OrderPDF user={props.user} order={item} />}
                    {item.status === "ok" &&
                        <div className="list-item-col"><i class="accept_status">Accepted</i></div>}
                    {item.status === "pending" &&
                        <div className="list-item-col">
                            <i
                                class="fa-solid fa-ban pending"
                                onClick={() => {
                                    handleBanClick(item._id)
                                }}
                            ></i>
                        </div>}
                    {item.status === "pending" &&
                        <div className="list-item-col"><i class="pending_status">Pending</i></div>}

                    {item.status === "denied" &&
                        <div className="list-item-col"><i class="fa-solid fa-download"></i></div>}
                    {item.status === "denied" &&
                        <div className="list-item-col"><i class="denied_status">Denied</i></div>}
                </div>
            ))}

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
