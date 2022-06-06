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
                    <div className='hp_card' key={item._id}>
                        <div className='hp_leftcard'>
                            <img src="..." className="img-fluid rounded-start" alt="..." />
                        </div>
                        <div className='hp_rightcard'>
                            <p className='hp_info' id='hp_name'><b>{item.name}</b></p>
                            <p className='hp_info'>{item.quantity}</p>
                            <p className='hp_info'>{item.category}</p>
                            <p className='hp_info' id='hp_des'>{item.description}</p>
                            <button type='button' className='hp_reg'
                                onClick={() => { handleRegister(item) }}>
                                <b>REGISTER</b>
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
