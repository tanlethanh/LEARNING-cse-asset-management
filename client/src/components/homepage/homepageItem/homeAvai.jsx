import React, { useState } from "react";
import Checklist from './homeChecklist';
import '../../../styles/homepage.css';

export default function AvaiItem(props) {

    const [registerItem, setRegisterItem] = useState([])
    const [itemPick, setItemPick] = useState([])

    const handleRegister = (e) => {
        if (!itemPick.includes(e)) {
            setRegisterItem([...registerItem, {
                item: e,
                quantity: 1
            }])
            setItemPick([...itemPick, e])
        }
    }

    const handleRemove = (e) => {
        if (itemPick.includes(e)) {
            setRegisterItem(registerItem.filter((element) => {
                return element.item != e
            }))

            setItemPick(registerItem.filter((element) => {
                return element != e
            }))
        }
    }

    return (
        <div className="homepage-card-container">
            {props.avai.map((item) => {
                return (
                    <div className='homepage_card' key={item._id}>
                        <div className='homepage_leftcard'>
                            <img src="..." className="img-fluid rounded-start" alt="..." />
                        </div>
                        <div className='homepage_rightcard'>
                            <p className='homepage_name'>{item.name}</p>
                            <ul className="homepage_info">
                                <li>Quantity: {item.available}/{item.quantity}</li>
                                <li>Category: {item.category}</li>
                                <li>Des: {item.description}</li>
                            </ul>

                            {
                                !itemPick.includes(item) ?
                                    <button className='homepage_reg' onClick={() => { handleRegister(item) }}>
                                        REGISTER
                                    </button> :
                                    <button className='homepage_added' onClick={() => { handleRemove(item) }}>
                                        ADDED
                                    </button>
                            }

                        </div>
                    </div>
                )
            })}
            {props.checklist &&
                <Checklist
                    registerItem={registerItem} setRegisterItem={setRegisterItem}
                    checklist={props.checklist} setChecklist={props.setChecklist}
                    itemPick={itemPick} setItemPick={setItemPick} />
            }


        </div>
    )
}
