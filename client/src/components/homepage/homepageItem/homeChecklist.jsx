import React, { useState, useEffect } from "react";
import Axios from "axios";
import './homeChecklist.css'
import AuthPage from "../../auth/authpage";

export default function Checklist(props) {
  const [change, setChange] = useState()
  const [test, setTest] = useState(true)

  const handleTrash = (e) => {
    props.setRegisterItem(props.registerItem.filter(item => item.item._id !== e))
    setTest(!test)
  }

  const handleSummit = () => {
    props.registerItem.map((item) => {
      Axios.post("http://localhost:8266/api/order/", {
        "quantity": item.quantity.toString(10),
        "idItem": item.item._id,
        "returnDate": new Date(),
      })

        .then((response) => {
          if (response.data.status === 401) {
            return (<AuthPage />)
          }
          props.setRegisterItem([])
          props.setChecklist(!props.checklist)
        })
    })
  }

  useEffect((test) => {
    setChange(test)
  }, [change])

  return (
    <div className="checklist-container">
      <div>
        <p className="checklist-title"><b>CHECKLIST</b></p>
      </div>

      <div className="scrollChecklist" id="checkList">
        {props.registerItem.map((item) => {
          return (
            <div className="checklist-card" key={item._id}>
              <p className="checklist-name"><b>{item.item.name}</b></p>
              <p className="checklist-note">Note: {item.item.decription}</p>
              <button className="buttonChecklist trash" onClick={() => { handleTrash(item.item._id) }}>
                <i class="fa-solid fa-trash-can"></i></button>
              {item.quantity !== 1 &&
                <button className="buttonChecklist" onClick={() => { item.quantity--; setTest(!test) }}>
                  <i class="fa-solid fa-minus"></i></button>}
              {item.quantity === 1 &&
                <button className="buttonChecklist limit"><i class="fa-solid fa-minus"></i></button>}
              <p className="checklist-quantity"><b>{item.quantity}</b></p>
              {item.quantity < item.item.available &&
                <button className="buttonChecklist" onClick={() => { item.quantity++; setTest(!test) }}>
                  <i class="fa-solid fa-plus"></i></button>}
              {item.quantity === item.item.available &&
                <button className="buttonChecklist limit"><i class="fa-solid fa-plus"></i></button>}
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
  )
}