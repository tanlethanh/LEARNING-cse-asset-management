export default function Alert({ alert, setOpenAlert }) {

    if (alert &&
        (
            alert.type === "error"
            || alert.type === "success"
            || alert.type === "warning"
        )
    ) {
        return (
            <div className={'alert_container ' + alert.type}>
                <div className='alert_icon'>
                    {alert.type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
                    {alert.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
                    {alert.type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
                </div>
                <div className='alert_content'>
                    <h3 className='alert_content_title'>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </h3>
                    <p className='alert_content_message'>
                        {alert.message}
                    </p>
                </div>
                <div className='display_none'>
                    {
                        setTimeout(function () {
                            setOpenAlert(false)
                        }, 1300)
                    }
                </div>

            </div>

        )
    }
}