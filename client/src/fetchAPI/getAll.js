import Axios from "axios";

export function getItems () {
    Axios.get("/api/item")
        .then(res => {
            return res.data.items
        })
        .catch(err => {
            return []
        })
}

export function getUsers () {
    Axios.get("/api/user")
        .then(res => {
            return res.data.users
        })
        .catch(err => {
            return null
        })
}

export function getOrders () {
    Axios.get("/api/order")
        .then(res => {
            return res.data.orders
        })
        .catch(err => {
            return null
        })
}