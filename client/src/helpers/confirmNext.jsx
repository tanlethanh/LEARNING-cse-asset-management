import React from 'react'

export default function ConfirmNext({ setOpen, message, callback }) {

    return (
        <div className='edit_info_background'>
            <div className='edit_info_container'>
                <div className='edit_info_body' style={{
                    "justifyContent": "center",
                    "alignItems": "center"
                }}>
                    {message
                        ? <label className='lable_body'>{message}</label>
                        : <label className='lable_body'>Are you sure to continue?</label>
                    }
                </div>

                <div className='edit_info_footer'>
                    <button className='button yes_button' onClick={() => { callback() }}>
                        Yes
                    </button>

                    <button className='button no_button' onClick={() => { setOpen(false) }}>
                        No
                    </button>
                </div>

            </div>
        </div>
    )


}