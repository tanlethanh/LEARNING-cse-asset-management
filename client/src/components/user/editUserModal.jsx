import React, { useState, useContext } from 'react';
import ConfirmPassword from '../../helpers/confirmPassword';
import convertValidName from '../../utils/convertValidName';
import Axios from 'axios'
import { AppContext } from '../../App';

export default function EditUserModal({
    user,
    isUpdated,
    setIsUpdated,
    setOpenEditUser,
}) {

    const { helpers } = useContext(AppContext)

    // properties of user
    const [email, setEmail] = useState(user.email)
    const [fullName, setFullName] = useState(user.fullName)
    const [studentCode, setStudentCode] = useState(user.studentCode)
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [password, setPassword] = useState("")

    // confirm admin password
    const [openConfirmAdminPassword, setOpenConfirmAdminPassword] = useState(false)

    const EditUser = (adminPassword) => {
        helpers.setOpenLoading(true)
        Axios.patch(`/api/user/${user._id}`, {
            email: email,
            fullName: fullName,
            studentCode: studentCode,
            phoneNumber: phoneNumber,
            password: password,
            adminPassword: adminPassword,
        })
            .then(response => {
                helpers.setOpenLoading(false)
                setIsUpdated(!isUpdated)
                setOpenEditUser(false)
                helpers.setAlert({
                    type: "success",
                    message: "Edit item successfully!"
                })
                helpers.setOpenAlert(true)
            })
            .catch(error => {
                helpers.setOpenLoading(false)
                helpers.setAlert({
                    type: "error",
                    message: error.response.data.message
                })
                helpers.setOpenAlert(true)
            })
    }

    return (
        <div className='edit_user_background'>
            {
                openConfirmAdminPassword &&
                <ConfirmPassword
                    setOpen={setOpenConfirmAdminPassword}
                    callback={EditUser}
                />
            }
            <div className='edit_user_container'>

                <h1 className='edit_user_title'>Edit detail user</h1>

                <div className='edit_user_body'>
                    <div className='edit_user_body_left'>
                        <label className='label_body'>Email</label>
                        <input className='input_body' type="text" placeholder={user.email} onChange={e => {
                            setEmail(e.target.value)
                        }} />
                        <label className='label_body'>Full name</label>
                        <input className='input_body' type="text" placeholder={user.fullName} onChange={e => {
                            setFullName(convertValidName(e.target.value))
                        }} />

                        <label className='label_body'>Student Code</label>
                        <input className='input_body' type="text" placeholder={user.studentCode} onChange={e => {
                            setStudentCode(e.target.value)
                        }} />

                        <label className='label_body'>Phone Number</label>
                        <input className='input_body' type="text" placeholder={user.phoneNumber} onChange={e => {
                            setPhoneNumber(e.target.value)
                        }} />

                        <label className='label_body'>Password</label>
                        <input className='input_body' type="text" placeholder="********" onChange={e => {
                            setPassword(e.target.value)
                        }} />


                    </div>

                </div>

                <div className='edit_user_footer'>
                    <button className='button' type="submit"
                        onClick={() => {
                            setOpenConfirmAdminPassword(true);
                        }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            setOpenEditUser(false);
                        }}
                    >
                        Cancel
                    </button>

                </div>
            </div>

        </div>
    )
}