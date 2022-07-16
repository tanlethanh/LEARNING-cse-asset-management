import React from 'react'

export default function ConfirmPassword({ setOpen, callback, action }) {
    let password = ""

    return (
        <div className='edit_info_background'>
            <div className='edit_info_container'>
                <div className='edit_info_body'>
                    {
                        action === "cancel_order" &&
                        <label className='lable_body'>Type your password to cancel this order!</label>
                    }
                    {
                        !action &&
                        <label className='lable_body'>Please type your password!</label>
                    }
                    <input
                        className='input_body'
                        type="password"
                        autoComplete="new-password"
                        onChange={e => {
                            password = e.target.value
                        }} />
                </div>

                <div className='edit_info_footer'>
                    <button className='button yes_button' type="submit" onClick={() => { callback(password) }}>Yes</button>

                    <button className='button no_button' onClick={() => { setOpen(false) }}>
                        No
                    </button>
                </div>

            </div>
        </div>
    )


}