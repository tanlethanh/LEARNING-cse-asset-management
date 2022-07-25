import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { arrangeList } from "../helpers/arrange";
import { AppContext } from "../App";

const optionsItems = {
    titlePosition: 'none',
    width: "50%",
    height: "50%",
    hAxis: {
        title: "Quantity",
        minValue: 0,
    },
    vAxis: {
        title: "Category",
    },
    legend: {
        position: 'top',
    }
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
    let numPending = 0
    let numProcess = 0
    let numDenied = 0
    let numDone = 0
    orders.forEach(order => {
        if (order.status === "denied") numDenied++
        else if (order.status === "done") numDone++
        else if (order.status === "pending") numPending++
        else if (order.status === "ok") numProcess++
    })
    return [
        ["Orders", "Quantity"],
        ["Done", numDone],
        ["Denied", numDenied],
        ["Pending", numPending],
        ["Process", numProcess]
    ]
}
export default function Statistic({ chosenListInMenu }) {

    const { data } = useContext(AppContext)

    if (!chosenListInMenu) chosenListInMenu = "items"

    const typeList = chosenListInMenu.split("_")[0]

    if (data[typeList].length === 0) return (
        <div className='statistic_container'>
        </div>
    )

    let dataStatistic
    if (typeList === "items") {
        dataStatistic = getDataItems(data.items)
    }
    else if (typeList === "users") {
        dataStatistic = getDataUsers(data.users)
    }
    else if (typeList === "orders") {
        dataStatistic = getDataOrders(data.orders)
    }
    else {
        return (
            <div className='statistic_container'>
            </div>
        )
    }

    return (
        <div className="statistic_container">
            {typeList === "items" &&
                <div className="statistic_content">
                    <h2 className="statistic_content_title">
                        Statistic of items
                    </h2>
                    <Chart
                        chartType="BarChart"
                        width="100%"
                        height="260px"
                        data={dataStatistic}
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
                            Total:  {(dataStatistic[2][1] + dataStatistic[3][1] + dataStatistic[1][1])}
                        </p>
                        <p>
                            Admin: {dataStatistic[1][1]}
                        </p>
                        <p>
                            Member: {dataStatistic[2][1]}
                        </p>
                        <p>
                            Register: {dataStatistic[3][1]}
                        </p>
                    </div>
                    <Chart
                        chartType="PieChart"
                        data={dataStatistic}
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
                            Total:  {(dataStatistic[1][1] + dataStatistic[2][1] + dataStatistic[3][1] + dataStatistic[4][1])}
                        </p>
                        <p>
                            Pending: {dataStatistic[3][1]}
                        </p>
                        <p>
                            Denied: {dataStatistic[2][1]}
                        </p>
                        <p>
                            In process: {dataStatistic[4][1]}
                        </p>
                        <p>
                            Done: {dataStatistic[1][1]}
                        </p>
                    </div>
                    <Chart
                        chartType="PieChart"
                        data={dataStatistic}
                        options={optionsUsers}
                        width={"100%"}
                        height={"200px"}
                    />
                </div>
            }
        </div>
    )
}