const Item = require("../models/item")

exports.getAllItem = (req, res) => {

    let availableItems = Item.find({available: {$gte: 1}}, 'name available category description')
    let unavailableItems = Item.find({available: 0}, 'name available category description')

    console.log(availableItems)
    console.log(unavailableItems)

    res.json({
        availableItems: availableItems,
        unavailableItems: unavailableItems
    })

}