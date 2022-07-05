import React from "react";
import { Chart } from "react-google-charts";
import { arrangeList } from "../arrange";

const optionsItems = {
    title: "Quantity of items in CSE-Asset",
    chartArea: { width: "50%", height: "80%" },
    hAxis: {
        title: "Quantity",
        minValue: 0
    },
    vAxis: {
        title: "Category",
    },
};

const optionsUsers = {
    title: "Users",
    chartArea: { width: "100%", height: "100%" },
};


function getDataItems(items) {
    let category = {
        All: {
            name: "All",
            total: 0,
            available: 0
        }
    }

    items.map(item => {
        if (!category[item.category]) {
            category[item.category] = {
                name: item.category,
                total: 0,
                available: 0
            }
        }
        category['All'].total += item.quantity
        category['All'].available += item.available
        category[item.category].total += item.quantity
        category[item.category].available += item.available
    })

    let data = []
    Object.keys(category).map(key => {
        data.push(category[key])
    })
    data = arrangeList(data, "total", "number", "dec")
    let returnData = [["Category", "Total", "Available"]]
    data.map(ele => {
        returnData.push([ele.name, ele.total, ele.available])
    })
    console.log(returnData)
    return returnData
}

function getDataUsers(users) {
    let numAdmin = 0
    let numMember = 0
    let numRegister = 0
    users.forEach(user => {
        if (user.isAdmin) {
            numAdmin++;
        }
        else {
            if (user.enable) numMember++
            else numRegister++;
        }
    });
    return [
        ["Users", "Quantity"],
        ["Admin", numAdmin],
        ["Member", numMember],
        ["Register", numRegister]
    ]
}

function getDataOrders(orders) {
    console.log(orders)
    const numPending = orders.pending.length
    const numProcess = orders.ok.length
    let numDenied = 0
    let numDone = 0
    orders.complete.forEach((order) => {
        if (order.status === "denied") numDenied++
        else if (order.status === "done") numDone++
    })
    return [
        ["Orders", "Quantity"],
        ["Done", numDone],
        ["Denied", numDenied],
        ["Pending", numPending],
        ["Process", numProcess]
    ]
}
export default function Statistic({ data }) {
    if (Object.keys(data).length === 0 || Object.keys(data.orders).length === 0) {
        return (
            <div className='statistic_container'>
            </div>
        )
    }
    const typeList = data.currentList.split("_")[0]
    const dataItems = getDataItems(data.items)
    const dataUsers = getDataUsers(data.users)
    const dataOrders = getDataOrders(data.orders)
    return (
        <div className="statistic_container">
            {console.log(data)}
            {typeList === "items" &&
                <div className="statistic_content">
                    <Chart
                        chartType="BarChart"
                        width="100%"
                        height="300px"
                        data={dataItems}
                        options={optionsItems}
                    />
                </div>
            }

            {typeList === "users" &&
                <div className="statistic_content">
                    <h2 className="statistic_content_title">
                        Statistic of users
                    </h2>
                    <div className="statistic_content_users">
                        <p>
                            Total:  {(dataUsers[2][1] + dataUsers[3][1] + dataUsers[1][1])}
                        </p>
                        <p>
                            Admin: {dataUsers[1][1]}
                        </p>
                        <p>
                            Member: {dataUsers[2][1]}
                        </p>
                        <p>
                            Register: {dataUsers[3][1]}
                        </p>
                    </div>
                    <Chart
                        chartType="PieChart"
                        data={dataUsers}
                        options={optionsUsers}
                        width={"100%"}
                        height={"200px"}
                    />
                </div>
            }

            {typeList === "orders" &&
                <div className="statistic_content">
                    <h2 className="statistic_content_title">
                        Statistic of orders
                    </h2>
                    <div className="statistic_content_users">
                        <p>
                            Total:  {(dataOrders[1][1] + dataOrders[2][1] + dataOrders[3][1] + dataOrders[4][1])}
                        </p>
                        <p>
                            Pending: {dataOrders[3][1]}
                        </p>
                        <p>
                            Denied: {dataOrders[2][1]}
                        </p>
                        <p>
                            In process: {dataOrders[4][1]}
                        </p>
                        <p>
                            Done: {dataOrders[1][1]}
                        </p>
                    </div>
                    <Chart
                        chartType="PieChart"
                        data={dataOrders}
                        options={optionsUsers}
                        width={"100%"}
                        height={"200px"}
                    />
                </div>
            }
        </div>
    )
}