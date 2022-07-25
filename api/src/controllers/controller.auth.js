const bcrypt = require("bcrypt")
const User = require('../models/model.user')
// const isAuthenticated = require('../helpers/isAuth.js')
const mongoose = require("mongoose")

const saltRounds = 10;

exports.getAuth = async (req, res) => {

    try {
        const user = await User.findById(req.session.userId)

        if (!user) {
            return res.status(404).json({ status: 404, message: "Not found this user!", user: null })
        }
        else {
            return res.status(200).json({ status: 200, message: "Get user by id successfully!", user })
        }

    } catch (error) {
        console.error(error)
        return res.status(406).json({ status: 406, message: error.message, user: null })
    }

}

/* 
 * We need to use validation to ensure that body is valid
 */

exports.register = async (req, res) => {
    try {
        // create hash password
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds)

        const newUser = new User({
            fullName: req.body.fullName,
            studentCode: req.body.studentCode,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            hash_password: hashPassword
        })

        // save new user into database
        const user = await newUser.save()

        res.status(201).json({ status: 201, message: "Register successfully!", user })

    } catch (error) {
        let errorMess = "Register failed"

        if (error.code == 11000) {
            if (error.keyValue.email && error.keyValue.studentCode) {
                errorMess = "Email or Student code is already exist"
            }
            else if (error.keyValue.email) {
                errorMess = "Email is already registered"
            }
            else if (error.keyValue.studentCode) {
                errorMess = "Student code is already registered"
            }
        }

        res.status(400).json({ status: 400, message: errorMess })
    }

}

exports.login = async (req, res) => {
    try {
        // find user by email in database, in case of email not found
        if (!req.body.email || !req.body.password) {
            throw { message: "Dont enough fields to login" }
        }

        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ status: 400, message: "User is not registered", user: null })
        }

        if (user.enable == false) {
            return res.status(400).json({ status: 400, message: "User is not enable", user: null })
        }

        // compare password using bcrypt.compare, dont create new hash password to compare
        const matchPassword = await bcrypt.compare(req.body.password, user.hash_password)

        // create session id for login when password is matched
        if (matchPassword) {
            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            await req.session.regenerate(function (err) {
                if (err) next(err)
                // store user information in session, typically a user id
                req.session.userId = user._id

                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save()

                // respone in callback to fix authentication
                res.status(201).json({ status: 201, message: "Login successfully!", user })
            })

        }
        else {
            res.status(400).json({ status: 400, message: "Wrong password!", user: null })
        }



    } catch (error) {
        console.error(error)
        res.status(400).json({ status: 400, message: error.message })
    }
}

exports.logout = async (req, res) => {
    // logout logic

    try {
        req.session.destroy((err) => {
            if (err) next(err)
            res.status(201).json({ status: 201, message: "Logout successfully!", user: null })
        })

    } catch (error) {
        console.error(error)
        res.status(400).json({ status: 400, message: error.message })
    }
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user

}


exports.changePassword = async (req, res) => {
    try {
        // create new hash password
        const hashPassword = await bcrypt.hash(req.body.newPassword, saltRounds)

        const user = await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(req.session.userId) },
            { hash_password: hashPassword },
            { new: true }
        )

        await req.session.destroy()
        res.status(201).json({ status: 201, message: "Change password successfully!", user })

    } catch (error) {
        console.error(error)
        res.status(400).json({ status: 400, message: error.message })
    }
}