const User = require("../models/user")
const Item = require("../models/item")
const Order = require("../models/order")

exports.adminInfor = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}

// manage item
exports.addItem = (req, res) => {
    Item.findOne({ name: req.body.name }, (err, item) => {
        if (!err && item) {
            res.json({ "mess": "This name already exists in list of items" })
        }
        else {
            // Add new item
            const newItem = new Item({
                name: req.body.name,
                available: req.body.quantity,
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
    Item.findOneAndDelete({ name: req.body.name }, (err, item) => {
        if (err) {
            res.json({
                "mess": "cannot delete"
            })
        }
        else {
            res.json({
                    item: item
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
    }, { new: true }, (err, item) => {
        if (err) {
            console.log(err)
            res.json({
                "mess": `Unable to edit ${req.body.name}`,
                "codeName": err.codeName
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

// manage user
exports.acceptMember = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}
exports.removeMember = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}
exports.enableAdmin = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}

// manage order
exports.acceptOrder = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}
exports.deniedOrder = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}
exports.doneOder = (req, res) => {
    res.json({
        mess: "Hello world"
    })
}