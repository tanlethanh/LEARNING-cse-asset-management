import React, { useContext } from "react";
import '../../../styles/homepage.css';
import { AppContext } from "../../../App";
export default function AvaiItem({ item }) {

    const { cart, setCart } = useContext(AppContext)

    const handleRegister = (item) => {
        if (cart.findIndex(itemInCart => itemInCart.name === item.name) === -1) {
            item.numberInCart = 1
            setCart([...cart, item])
        }
    }

    const handleRemove = (item) => {
        item.numberInCart = 0
        const newCart = cart.filter(itemInCart => itemInCart.name !== item.name)
        if (newCart !== cart) setCart(newCart)
    }

    return (
        <div className='homepage_card'>
            <div className='homepage_leftcard'>
                <img src={item.image ? item.image : "./big_logo.png"} className="homepage_image img-fluid rounded-start" alt="..." />
            </div>
            <div className='homepage_rightcard'>
                <p className='homepage_name'>{item.name}</p>
                <ul className="homepage_info">
                    <li>Quantity: {item.available}/{item.quantity}</li>
                    <li>Category: {item.category}</li>
                    <li>Des: {item.description}</li>
                </ul>

                {
                    item.numberInCart && item.numberInCart !== 0 ?
                        <button className='homepage_added' onClick={() => { handleRemove(item) }}>
                            ADDED
                        </button> :
                        <button className='homepage_reg' onClick={() => { handleRegister(item) }}>
                            REGISTER
                        </button>

                }

            </div>
        </div>
    )
}
