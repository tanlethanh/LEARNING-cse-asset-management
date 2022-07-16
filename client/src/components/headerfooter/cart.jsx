import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Alert from "../alert";
import { AppContext } from "../../App";
import '../../styles/cart.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/waiting.css';

export default function Cart(props) {
  const { cart, setCart, isUpdatedMainUser, setIsUpdatedMainUser } = useContext(AppContext)
  const [change, setChange] = useState(false)

  // For alert
  const [alert, setAlert] = useState(false)
  const [alertMess, setAlertMess] = useState('')
  const [typeAlert, setTypeAlert] = useState('')

  // For submit modal
  const [openModal, setOpenModal] = useState(false)
  const [waitingLoad, setWaitingLoad] = useState(false)

  const handleRemove = (name) => {
    const newCart = cart.filter(itemInCart => itemInCart.name !== name)
    if (newCart !== cart) setCart(newCart)
  }

  const handleIncrease = (index) => {
    if (cart[index].numberInCart < cart[index].available) {
      cart[index].numberInCart++;
      setChange(!change)
    }
  }

  const handleDecrease = (index) => {
    if (cart[index].numberInCart > 1) {
      cart[index].numberInCart--;
      setChange(!change)
    }
  }

  const handleNextButton = () => {
    setOpenModal(true)
  }

  function ModalSubmit() {
    const submitChecklist = () => {
      cart.map((item, index) => {
        if (item.isChosen && !item.returnDate) {
          setTypeAlert("error")
          setAlertMess("Chosen item must have return date!")
          setAlert(false)
          setAlert(true)
        }
        if (item.isChosen && item.returnDate) {
          setWaitingLoad(true)
          Axios.post("/api/order/", {
            "quantity": item.numberInCart.toString(10),
            "idItem": item._id,
            "returnDate": item.returnDate,
          })
            .then((response) => {
              setTypeAlert("success")
              setAlertMess("You can check new order in dashboard!")
              setAlert(false)
              setAlert(true)
              setIsUpdatedMainUser(!isUpdatedMainUser)
              setWaitingLoad(false)
            })
            .catch((error) => {
              if (error.response.data.status === 401) {
                setTypeAlert("warning")
                setAlertMess("You are not logged in!")
                setAlert(false)
                setAlert(true)
                setWaitingLoad(false)
              }
            })
        }
        setCart(cart.filter(item => !(item.isChosen && item.returnDate)))
      })

      // setOpenModal(false)
    }
    const handleClose = () => {
      setOpenModal(false)
    }
    
    return (
      <div className="checklist-submit-modal">
        {
          waitingLoad && 
          <body className="load">
            <div className="waiting-load">
              <span className="fa-solid fa-spinner rotate-around icon"></span>
            </div>
          </body>
        }
        <div className="checklist-submit-modal-container">
          <div className="checklist-submit-modal-title">
            <h2>Hello title modal</h2>
          </div>
          <div className="checklist-submit-modal-content scrollChecklist">
            {cart.map((item, index) => {
              return (
                <div className="checklist-card" key={item._id}>

                  <div className="checklist-card-top">
                    <div className="checklist-card-top-left">
                      {item.name}
                    </div>
                    <div className="checklist-card-top-right">
                      <button className="checklist-button trash" onClick={() => { handleRemove(item._id) }}>
                        <i className="fa-solid fa-trash-can"></i></button>
                      {item.numberInCart < item.available &&
                        <button className="checklist-button" onClick={() => { handleIncrease(index) }}>
                          <i className="fa-solid fa-plus"></i></button>}
                      {item.numberInCart === item.available &&
                        <button className="checklist-button limit"><i className="fa-solid fa-plus"></i></button>}
                      <p className="checklist-quantity">{item.numberInCart}</p>
                      {item.numberInCart !== 1 &&
                        <button className="checklist-button" onClick={() => { handleDecrease(index) }}>
                          <i className="fa-solid fa-minus"></i></button>}
                      {item.numberInCart === 1 &&
                        <button className="checklist-button limit"><i className="fa-solid fa-minus"></i></button>}

                    </div>
                  </div>

                  <div className="checklist-card-bottom">
                    <div className="checklist-card-bottom-left">
                      <p>Return date:</p>
                      {
                        <DatePicker
                          selected={item.returnDate}
                          onChange={(date) => {
                            item.returnDate = date
                            setChange(!change)
                          }}
                          className="checklist-datepicker"
                          minDate={new Date()}
                          placeholderText="Select a date"
                        />
                      }

                    </div>
                    <div className="checklist-card-bottom-right">
                      {(!item.returnDate && item.isChosen) &&
                        <p>You must choose return day to submit!</p>
                      }
                      {(item.returnDate && item.isChosen) &&
                        <p className="checklist-valid">You can submit to borrow this item!</p>
                      }
                    </div>
                  </div>

                  <div className="checklist-card-checkbox">
                    <input defaultChecked={item.isChosen} type="checkbox" onClick={
                      () => {
                        if (!item.isChosen) {
                          item.isChosen = true
                        }
                        else {
                          item.isChosen = !item.isChosen
                        }
                        setChange(!change)
                      }
                    }></input>
                  </div>




                </div>
              )
            })}
          </div>

          <div className="checklist-submit-modal-button">
            <button
              className="checklist-submit-modal-button-submit"
              onClick={submitChecklist}
            >
              Submit
            </button>
            <button
              className="checklist-submit-modal-button-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checklist-background">
      <Alert
        type={typeAlert}
        message={alertMess}
        alert={alert}
        setAlert={setAlert}
      />

      {
        openModal && <ModalSubmit />
      }
      <div className="checklist-container">
        <div className="checklist-header">
          <p className="checklist-title">Your cart</p>
        </div>

        <div className="checklist-content scrollChecklist" id="checkList">
          {cart.map((item, index) => {
            return (
              <div className="checklist-card" key={item._id}>
                <p className="checklist-name">{item.name}</p>
                <p className="checklist-note">Note: {item.description}</p>
                <button className="checklist-button trash" onClick={() => { handleRemove(item.name) }}>
                  <i className="fa-solid fa-trash-can"></i></button>
                {
                  item.numberInCart < item.available &&
                  <button className="checklist-button" onClick={() => { handleIncrease(index) }}>
                    <i className="fa-solid fa-plus"></i></button>
                }
                {
                  item.numberInCart === item.available &&
                  <button className="checklist-button limit"><i className="fa-solid fa-plus"></i></button>
                }
                <p className="checklist-quantity">{item.numberInCart}</p>
                {
                  item.numberInCart !== 1 &&
                  <button className="checklist-button" onClick={() => { handleDecrease(index) }}>
                    <i className="fa-solid fa-minus"></i></button>
                }
                {
                  item.numberInCart === 1 &&
                  <button className="checklist-button limit"><i className="fa-solid fa-minus"></i></button>
                }

              </div>
            )
          })}
        </div>

        <div className="checklist-submit">
          <div className="checklist-item-quantity">
            <p>Quantity:</p>
            <p>{cart.length}</p>
          </div>

          <button className="checklist-submit-button" onClick={() => { handleNextButton() }}>
            <b>SUBMIT</b>
          </button>
        </div>
      </div>
    </div>
  )
}