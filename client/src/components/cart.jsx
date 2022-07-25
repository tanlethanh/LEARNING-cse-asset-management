import React, { useState, useContext } from "react";
import Axios from "axios";
import { AppContext } from "../App";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../styles/cart.css'

export default function Cart() {
  const { cart, setCart, helpers, mainUser } = useContext(AppContext)
  const [change, setChange] = useState(false)
  const [firstOpenModal, setFirstOpenModal] = useState(false)

  // For submit modal
  const [openModal, setOpenModal] = useState(false)

  const handleRemove = (item) => {
    item.numberInCart = 0
    const newCart = cart.filter(itemInCart => itemInCart.name !== item.name)
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
    setFirstOpenModal(true)
  }

  function ModalSubmit() {
    const submitChecklist = () => {
      firstOpenModal && setFirstOpenModal(false)
      cart.map((item, index) => {
        if (item.isChosen && !item.returnDate) {
          helpers.setAlert({
            type: "error",
            message: "Chosen item must have return date!"
          })
          helpers.setOpenAlert(true)
        }
        if (item.isChosen && item.returnDate) {

          helpers.setOpenLoading(true)

          Axios.post("/api/order/", {
            "quantity": item.numberInCart.toString(10),
            "idItem": item._id,
            "returnDate": item.returnDate,
          })
            .then((response) => {

              mainUser.orders.push(response.data.order)
              mainUser.setOrders([...mainUser.orders])
              mainUser.infor.orders.push(response.data.order._id)

              helpers.setOpenLoading(false)
              helpers.setAlert({
                type: "success",
                message: "The order need to be accepted by admin, you can check this order in your orders! "
              })
              helpers.setOpenAlert(true)

              // reset cart and item
              setCart(cart.filter(item => !(item.isChosen && item.returnDate)))
              item.isChosen = false
              item.numberInCart = 0
              item.returnDate = null
              

            })
            .catch((error) => {
              if (error.response.data.status === 401) {
                helpers.setOpenLoading(false)
                helpers.setAlert({
                  type: "warning",
                  message: "You are not logged in!"
                })
                helpers.setOpenAlert(true)
              }
            })
        }
      })

      // setOpenModal(false)
    }
    const handleClose = () => {
      setOpenModal(false)
      setFirstOpenModal(false)
    }

    return (
      <div className="checklist-submit-modal">
        <div className={"checklist-submit-modal-container "+ (firstOpenModal && "first")}>
          <div className="checklist-submit-modal-title">
            <h2>PLEASE SET RETURN DATE</h2>
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
                      <button className="checklist-button trash" onClick={() => { handleRemove(item) }}>
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
                        firstOpenModal && setFirstOpenModal(false)
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
                <button className="checklist-button trash" onClick={() => { handleRemove(item) }}>
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