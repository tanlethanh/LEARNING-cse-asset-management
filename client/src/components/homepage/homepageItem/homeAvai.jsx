import React, { useState } from "react";
import '../homepage.css'
import Checklist from './homeChecklist';
import './homeChecklist.css'

export default function AvaiItem(props) {

    const [registerItem, setRegisterItem] = useState([])
    const [itemPick, setItemPick] = useState([])

    const handleRegister = (e)=>{
        if (!itemPick.includes(e)){
            setRegisterItem([...registerItem, {
                item: e,
                quantity: 1
            }])
            setItemPick([...itemPick, e])    
        }
    }

    return (
        <div>
            {props.avai.map((item) => {
                return (
                    <div className='homepage_card' key={item._id}>
                        <div className='homepage_leftcard'>
                            <img src="..." className="img-fluid rounded-start" alt="..." />
                        </div>
                        <div className='homepage_rightcard'>
                            <p className='homepage_name'>{item.name}</p>
                            <ul>
                                <li className='homepage_info'>Quantity: {item.available}/{item.quantity}</li>
                                <li className='homepage_info'>Category: {item.category}</li>
                                <li className='homepage_info' id='hp_des'>Des: {item.description}</li>
                            </ul>
                            <button className='homepage_reg' onClick={() => { handleRegister(item) }}>
                                REGISTER
                            </button>
                        </div>
                    </div>
                )
            })}
            {props.checklist && 
                <Checklist 
                registerItem = {registerItem} setRegisterItem={setRegisterItem} 
                checklist={props.checklist} setChecklist={props.setChecklist}
                itemPick = {itemPick} setItemPick = {setItemPick}/>
            }
                     
            
        </div>            
    )
}