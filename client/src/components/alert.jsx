import React, { useEffect, useState } from 'react';
import '../styles/alert.css'

export default function Alert({ type, message, alert, setAlert }) {

    if (type === "error" || type === "success" || type === "warning") {
        return (
            alert && 
            <div className={'alert_container ' + type}>
                <div className='alert_icon'>
                    {/* <i>Hello</i> */}
                    {type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
                    {type === 'success' && <i className="fa-solid fa-circle-check"></i>}
                    {type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
                </div>
                <div className='alert_content'>
                    <h3 className='alert_content_title'>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <p className='alert_content_message'>
                        {message}
                    </p>
                </div>
                <div className='display_none'>
                {
                    setTimeout(function () {
                        setAlert(false)
                    }, 1500)
                }
                </div>
                
            </div>

        )
    }
}