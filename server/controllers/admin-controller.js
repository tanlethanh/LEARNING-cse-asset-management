const User = require("../models/user")
const Item = require("../models/item")
const Order = require("../models/order")
const { request } = require("express")

exports.addItem = (req, res) => {

    Item.findOne({ name: req.body.name }, (err, item) => {
        if (!err && item) {
            res.json({ "mess": "This name already exists in list of items" })
        }
        else {
            // Add new item
            const newItem = new Item({
                name: req.body.name,
                quantity: req.body.quantity,
                category: req.body.category,
                desciption: req.body.desciption,
            })

            newItem.save((err, item) => {
                if (err) {
                    console.log(err)
                    res.json({
                        "mess": "Unable to add new item"
                    })
                }
                else {
                    res.json({
                        "mess": "Add new item successfully",
                        item
                    })
                }
            })
            // add successfully
        }
    })

}

exports.removeItem = (req, res) => {

    Item.findOne({ name: req.body.name }, (err, item) => {
        if (!err && !item) {
            res.json({ "mess": "This item doesn't exist yet" })
        }
        else {
            console.log(item)
            User.deleteOne({ name: req.body.name }, (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err)
                    res.json({
                        "mess": `Unable to remove ${req.body.name}`
                    })
                }
                else {
                    res.json({
                        "mess": `Remove ${req.body.name} successfully!`
                    })
                }
            })
        }
    })
    
}

exports.editItem = (req, res) => {

    Item.findOneAndUpdate({ name: req.body.name }, {
        name: req.body.newName,
        quantity: req.body.newQuantity,
        category: req.body.newCategory,
        desciption: req.body.newDesciption,
    }, {new: true}, (err, item) => {
        if(err) {
            console.log(err)
            res.json({
                "mess": `Unable to edit ${req.body.name}`
            })
        }
        else {
            res.json({
                "mess": `Edit ${req.body.name} successfully!`,
                item
            })
        }
    })
}
