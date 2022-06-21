import React, { useState, useEffect } from "react";
import Axios from "axios";
import Alert from "../../alert";
import '../../../styles/homeChecklist.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export default function Checklist(props) {
  const [change, setChange] = useState()
  const [test, setTest] = useState(true)

  // For alert
  const [alert, setAlert] = useState(false)
  const [alertMess, setAlertMess] = useState('')
  const [typeAlert, setTypeAlert] = useState('')

  // For submit modal
  const [openModal, setOpenModal] = useState(false)

  const handleTrash = (e) => {
    props.setRegisterItem(props.registerItem.filter(item => item.item._id != e))
    props.setItemPick(props.itemPick.filter(item => item._id != e))
    setTest(!test)
  }

  const handleNextButton = () => {
    setOpenModal(true)
  }

  useEffect((test) => {
    setChange(test)
  }, [change])

  function ModalSubmit() {

    const submitChecklist = () => {

      props.registerItem.map((item) => {

        if (item.isChosen && !item.returnDate) {
          setTypeAlert("error")
          setAlertMess("Chosen item must have return date!")
          setAlert(false)
          setAlert(true)
        }

        if (item.isChosen && item.returnDate) {
          Axios.post("http://localhost:8266/api/order/", {
            "quantity": item.quantity.toString(10),
            "idItem": item.item._id,
            "returnDate": item.returnDate,
          })
            .then((response) => {
              setTypeAlert("success")
              setAlertMess("You can check new order in dashboard!")
              setAlert(false)
              setAlert(true)

              props.setRegisterItem(props.registerItem.filter(item => !(item.isChosen && item.returnDate)))
              // setTimeout(() => {
              //   // props.setItemPick(props.itemPick.filter(item => item._id != e))
              //   // props.setChecklist(!props.checklist)
              // }, 1000)


            })
            .catch((error) => {
              if (error.response.data.status === 401) {
                setTypeAlert("warning")
                setAlertMess("You are not logged in!")
                setAlert(false)
                setAlert(true)
              }
            })
        }
      })

      // setOpenModal(false)
    }
    const handleClose = () => {
      setOpenModal(false)
    }




    return (
      <div className="checklist-submit-modal">
        <div className="checklist-submit-modal-container">
          <div className="checklist-submit-modal-title">
            <h2>Hello title modal</h2>
          </div>
          <div className="checklist-submit-modal-content scrollChecklist">
            {props.registerItem.map((item) => {
              return (
                <div className="checklist-card" key={item._id}>

                  <div className="checklist-card-top">
                    <div className="checklist-card-top-left">
                      {item.item.name}
                    </div>
                    <div className="checklist-card-top-right">
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
                  </div>

                  <div className="checklist-card-bottom">
                    <div className="checklist-card-bottom-left">
                      <p>Return date:</p>
                      {
                        <DatePicker
                          selected={item.returnDate}
                          onChange={(date) => {
                            item.returnDate = date
                            setTest(!test)
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
                    <input checked={item.isChosen} type="checkbox" onClick={
                      () => {
                        if (!item.isChosen) {
                          item.isChosen = true
                        }
                        else {
                          item.isChosen = !item.isChosen
                        }
                        setTest(!test)
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

          <button className="checklist-submit-button" onClick={() => { handleNextButton() }}>
            <b>Next step!</b>
          </button>
        </div>
      </div>
    </div>
  )
}