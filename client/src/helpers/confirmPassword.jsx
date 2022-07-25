export default function ConfirmPassword({ setOpen, callback, action }) {
    let password = ""

    return (
        <div className='confirm_password_background'>
            <div className='confirm_password_container'>
                <div className='confirm_password_body'>
                    {
                        action === "cancel_order" &&
                        <label className='label_body'>Type your password to cancel this order!</label>
                    }
                    {
                        !action &&
                        <label className='label_body'>Please type your password!</label>
                    }
                    <input
                        className='input_body'
                        type="password"
                        autoComplete="new-password"
                        onChange={e => {
                            password = e.target.value
                        }} />
                </div>

                <div className='confirm_password_footer'>
                    <button className='button yes_button' type="submit" onClick={() => { callback(password) }}>Yes</button>

                    <button className='button no_button' onClick={() => { setOpen(false) }}>
                        No
                    </button>
                </div>

            </div>
        </div>
    )


}