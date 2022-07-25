const mongoose = require('mongoose')
const Order = require('../models/model.order')
const User = require('../models/model.user')
const Item = require('../models/model.item')
const { isAdmin, isAdminWithPassword } = require('../helpers/isAdmin.js')

exports.getAllOrder = async (req, res) => {
    if (await isAdmin(req.session.userId)) {
        try {
            const orders = await Order.find()
            res.status(200).json({ status: 200, message: "Get all of orders successfully!", orders })
        } catch (error) {
            console.error(error)
            res.status(406).json({ status: 406, message: error.message, orders: null })
        }
    }
    else {
        res.status(403).json({ status: 403, message: "Forbidden!", items: null })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(mongoose.Types.ObjectId(req.params.id))
        if (!order) {
            return res.status(404).json({ status: 404, message: "Not found this order!", order: null })
        }
        else {
            return res.status(200).json({ status: 200, message: "Get order by id successfully!", order })
        }
    } catch (error) {
        console.error(error)
        return res.status(406).json({ status: 406, message: error.message, order: null })
    }
}

exports.createNewOrder = async (req, res) => {
    try {
        const idUser = mongoose.Types.ObjectId(req.session.userId)

        // Check existing item and number of available item
        const item = await Item.findById(req.body.idItem)
        if (!item) {
            return res.status(400).json({ status: 400, message: "Bad request, id of item is not valid", order: null })
        }

        if (item.available < req.body.quantity) {
            return res.status(201).json({
                status: 201,
                message: "Number of available items is smaller than quantity which user want to borrow",
                order: null
            })
        }

        const user = await User.findById(idUser)

        // New order will be saved into database if all of fields are valid
        const newOrder = new Order({
            nameItem: item.name,
            nameUser: user.fullName,
            categoryItem: item.category,
            quantity: req.body.quantity,
            idItem: req.body.idItem,
            idUser: req.session.userId,
            returnDate: req.body.returnDate
        })

        const order = await newOrder.save()

        // Update new order for user
        await User.findByIdAndUpdate(idUser, { $push: { orders: order._id } }, { new: true })

        res.status(201).json({ status: 201, message: "Add new order successfully!", order })

    } catch (error) {
        console.error(error)
        res.status(400).json({ status: 400, message: error.message, order: null })
    }

}

exports.updateStateOrderByID = async (req, res) => {
    if (await isAdminWithPassword(req.session.userId, req.body.adminPassword)) {
        try {
            const id = mongoose.Types.ObjectId(req.params.id)
            const order = await Order.findById(id)

            if (!order) {
                return res.status(404).json({ status: 404, message: "Not found this order!", order: null })
            }

            let updatedOrder = null
            if (!req.query) {
                return res.status(400).json({ status: 400, message: "Bad request", user: null })
            }

            // change state of order
            if (req.query.action === "deny") {

                if (order.status !== "pending") {
                    return res.status(400).json({
                        status: 400,
                        message: `State of this order is not \'pending\', action: ${req.query.action}`,
                        order: null
                    })
                }
                updatedOrder = await Order.findByIdAndUpdate(id, { status: "denied" }, { new: true })
            }
            else if (req.query.action === "accept") {
                /*
                 * Check status of order
                 * Check existing item and number of available item 
                 * Add new borrower into borrowerList of item 
                 * Update order status
                 */
                if (order.status !== "pending") {
                    return res.status(400).json({
                        status: 400,
                        message: `status of this order is not \'pending\', action: ${req.query.action}`,
                        order: null
                    })
                }

                // Check existing item and number of available item
                const item = await Item.findById(order.idItem)
                if (!item) {
                    return res.status(400).json({ status: 400, message: "Bad request, id of item is not valid", order: null })
                }

                if (item.available < order.quantity) {
                    return res.status(201).json({
                        status: 201,
                        message: "Number of available items is smaller than quantity which user want to borrow",
                        order: null
                    })
                }

                // Add new borrower into borrowerList of item 
                const newBorrowerOfItem = { idUser: order.idUser, idOrder: order._id, quantity: order.quantity, date: order.date }
                await Item.findByIdAndUpdate(
                    order.idItem,
                    {
                        $push: { borrowerList: newBorrowerOfItem },
                        available: item.available - order.quantity
                    },
                    { new: true }
                )

                // Update order
                updatedOrder = await Order.findByIdAndUpdate(id, { status: "ok" }, { new: true })
            }
            else if (req.query.action === "confirm") {
                if (order.status !== "ok") {
                    return res.status(400).json({
                        status: 400,
                        message: `status of this order is not \'ok\', action: ${req.query.action}`,
                        order: null
                    })
                }

                // update state in borrower list of this item
                await Item.updateOne(
                    { _id: order.idItem, "borrowerList.idOrder": order._id },
                    {
                        $set: {
                            "borrowerList.$.status": "done"
                        },
                        $inc: { 'available': order.quantity }
                    }
                )

                // update state of order
                updatedOrder = await Order.findByIdAndUpdate(id, { status: "done" }, { new: true })
            }
            else {
                return res.status(400).json({ status: 400, message: "Bad request", order: null })
            }


            // response
            res.status(201).json({
                status: 201,
                message: `${req.query.action} order successfully!`,
                user: updatedOrder
            })

        } catch (error) {
            // console.error(error)
            res.status(400).json({ status: 400, message: error.message, order: null })
        }
    }
    else {
        res.status(403).json({ status: 403, message: "Forbidden!", order: null })
    }
}

exports.deleteOrderById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.userId })
        const order = await Order.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ status: 404, message: "User is not found!", user: null })
        }
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order is not found!", order: null })
        }

        // if this user is admin, we will delete any order
        if (user.isAdmin) {
            await User.findByIdAndUpdate(order.idUser, { $pull: { orders: order._id } })
            await Order.findByIdAndDelete(order._id)

            if (order.status === "ok") {
                await Item.findByIdAndUpdate(order.idItem, {
                    $pull: { borrowerList: [{ idOrder: order._id }] },
                    $inc: { available: order.quantity }
                })
            }

            return res.status(204).json({ status: 204, message: "Delete order successfully!" })
        }
        // if not, we just delete when this order belong to user and status is pending
        else {
            let doesOrderBelongUser = false

            for (let index = 0; index < user.orders.length; index++) {
                if (String(user.orders[index]) === String(order._id)) {
                    doesOrderBelongUser = true
                    break
                }
            }

            if (doesOrderBelongUser) {
                if (order.status === 'pending') {
                    await Order.findByIdAndDelete(order._id)
                    await User.findByIdAndUpdate(user._id, { $pull: { orders: order._id } })
                    return res.status(204).json({ status: 204, message: "Delete order successfully!" })
                }
                else {
                    return res.status(400).json({ status: 400, message: "Status of this order is not pending" })
                }
            }
            else {
                return res.status(400).json({ status: 400, message: "This order does not belong to user" })
            }
        }
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message, order: null })
    }

}