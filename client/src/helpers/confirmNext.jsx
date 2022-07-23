import React from 'react'
import "../styles/confirmNext.css"

export default function ConfirmNext({ setOpen, message, callback }) {

    return (
        <div className='confirm_next_background'>
            <div className='confirm_next_container'>
                <div className='confirm_next_body' style={{
                    "justifyContent": "center",
                    "alignItems": "center"
                }}>
                    {message
                        ? <label className='lable_body'>{message}</label>
                        : <label className='lable_body'>Are you sure to continue?</label>
                    }
                </div>

                <div className='confirm_next_footer'>
                    <button className='button yes_button' onClick={() => { callback() }}>
                        Yes
                    </button>

                    <button className='button cancel_button' onClick={() => { setOpen(false) }}>
                        No
                    </button>
                </div>

            </div>
        </div>
    )


}