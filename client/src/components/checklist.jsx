import React, { useState, useEffect } from "react";
import Axios from "axios";
import Alert from "./alert";
import '../styles/homeChecklist.css'

export default function Checklist(props) {
  const [change, setChange] = useState()
  const [test, setTest] = useState(true)

  // For alert
  const [alert, setAlert] = useState(false)
  const [alertMess, setAlertMess] = useState('')

  const handleTrash = (e) => {
    // props.setRegisterItem(props.registerItem.filter(item => item.item._id != e))
    // props.setItemPick(props.itemPick.filter(item => item._id != e))
    // setTest(!test)
  }

  const handleSummit = () => {
    props.registerItem.map((item) => {
      Axios.post("http://localhost:8266/api/order/", {
        "quantity": item.quantity.toString(10),
        "idItem": item.item._id,
        "returnDate": new Date(),
      })
        .then((response) => {
          props.setRegisterItem([])
          props.setChecklist(!props.checklist)
        })
        .catch((error) => {
          if (error.response.data.status === 401) {
            console.log("Hereee")
            setAlertMess("You are not logged in!")
            setAlert(false)
            setAlert(true)
          }
        })
    })
  }

  useEffect((test) => {
    setChange(test)
  }, [change])

  return (
    <div className="checklist-background">
      <Alert
        type="warning"
        message={alertMess}
        alert={alert}
        setAlert={setAlert}
      />
      <div className="checklist-container">
        <div className="checklist-header">
          <p className="checklist-title">CHECKLIST</p>
        </div>

        <div className="checklist-content scrollChecklist" id="checkList">
          {props.registerItem.map((item) => {
            return (
              <div className="checklist-card" key={item._id}>
                <p className="checklist-name">{item.item.name}</p>
                <p className="checklist-note">Note: {item.item.decription}</p>
                <button className="checklist-button trash" onClick={() => { handleTrash(item.item._id) }}>
                  <i className="fa-solid fa-trash-can"></i></button>
                {item.quantity !== 1 &&
                  <button className="checklist-button" onClick={() => { item.quantity--; setTest(!test) }}>
                    <i className="fa-solid fa-minus"></i></button>}
                {item.quantity === 1 &&
                  <button className="checklist-button limit"><i className="fa-solid fa-minus"></i></button>}
                <p className="checklist-quantity">{item.quantity}</p>
                {item.quantity < item.item.available &&
                  <button className="checklist-button" onClick={() => { item.quantity++; setTest(!test) }}>
                    <i className="fa-solid fa-plus"></i></button>}
                {item.quantity === item.item.available &&
                  <button className="checklist-button limit"><i className="fa-solid fa-plus"></i></button>}
              </div>
            )
          })}
        </div>

        <div className="checklist-submit">
          <div className="checklist-item-quantity">
            <p>Quantity:</p>
            <p>{props.registerItem.length}</p>
          </div>

          <button className="checklist-submit-button" onClick={() => { handleSummit() }}>
            <b>SUBMIT</b>
          </button>
        </div>
      </div>
    </div>
  )
}