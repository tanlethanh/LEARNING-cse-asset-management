const isAdmin = require('../helpers/isAdmin.js')
const User = require('../models/model.user')
const mongoose = require('mongoose')

exports.getAllUsers = async (req, res) => {
    if (await isAdmin(req.session.userId)) {
        try {
            const users = await User.find()
            res.status(200).json({ status: 200, messages: "Get all of users successfully!", users })
        } catch (error) {
            console.error(error)
            res.status(406).json({ status: 406, messages: error.message, users: null })
        }
    }
    else {
        res.status(403).json({ status: 403, messages: "Forbidden!", items: null })
    }
}
exports.getUserById = async (req, res) => {
    if (await isAdmin(req.session.userId)) {
        console.log("Get user By Id")
        try {
            const user = await User.findById(mongoose.Types.ObjectId(req.params.id))
            if (!user) {
                res.status(404).json({ status: 404, messages: "Not found this user!", user: null })
            }
            else {
                res.status(200).json({ status: 200, messages: "Get user by id successfully!", user })
            }
        } catch (error) {
            console.error(error)
            res.status(406).json({ status: 406, messages: error.message, user: null })
        }
    }
    else {
        res.status(403).json({ status: 403, messages: "Forbidden!", user: null })
    }
}
exports.togglePermission = async (req, res, next) => {
    if (await isAdmin(req.session.userId)) {
        try {
            const id = mongoose.Types.ObjectId(req.params.id)
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({ status: 404, messages: "Not found this user!", user: null })
            }

            let updateUser
            if (!req.query) {
                return res.status(400).json({ status: 400, messages: "Bad request", user: null })
            }
            if (req.query.togglePermission === "enable") {
                updateUser = await User.findByIdAndUpdate(id, {enable: !user.enable, isAdmin: false}, {new: true})
            }
            else if (req.query.togglePermission === "admin") {
                updateUser = await User.findByIdAndUpdate(id, {isAdmin: !user.isAdmin, enable: true}, {new: true})
            }
            else {
                return res.status(400).json({ status: 400, messages: "Bad request", user: null })
            }

            res.status(201).json({ status: 201, messages: `Toggle ${req.query.togglePermission} permission successfully!`, user: updateUser })

        } catch (error) {
            // console.error(error)
            res.status(400).json({ status: 400, messages: error.message, user: null })
        }
    }
    else {
        res.status(403).json({ status: 403, messages: "Forbidden!", items: null })
    }
}
exports.deleteUserById = async (req, res) => {
    if (await isAdmin(req.session.userId)) {
        try {
            const user = await User.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) })
            
            if (user) {
                res.status(204).json({})
            }
            else {
                return res.status(404).json({ status: 404, messages: "Not found this user!", user: null })
            }


        } catch (error) {
            console.error(error)
            res.status(400).json({ status: 400, messages: error.message, user: null })
        }
    }
    else {
        res.status(403).json({ status: 403, messages: "Forbidden!", user: null })
    }
}