export default function ConfirmNext({ setOpen, message, callback }) {

    return (
        <div className='confirm_next_background'>
            <div className='confirm_next_container'>
                <div className='confirm_next_body' style={{
                    "justifyContent": "center",
                    "alignItems": "center"
                }}>
                    {message
                        ? <label className='label_body'>{message}</label>
                        : <label className='label_body'>Are you sure to continue?</label>
                    }
                </div>

                <div className='confirm_next_footer'>
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