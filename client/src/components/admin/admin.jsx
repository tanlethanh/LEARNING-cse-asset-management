import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../App';
import NotFoundPage from '../../helpers/notFoundPage';
import Statistic from "../statistic"
import Items from './items';
import Users from './users';
import Orders from './orders';
import '../../styles/admin.css'
import '../../styles/button.scss'

export default function Admin() {

    const { mainUser } = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const type = searchParams.get("type")

    if (!mainUser.infor.isAdmin) return <NotFoundPage />

    return (
        <div className="dashboard_container">

            <div id="information">
                <div className="title">
                    <h1 className="name">
                        {mainUser.infor.fullName}
                    </h1>
                    <h2 className="description">
                        {mainUser.infor.isAdmin ? "Admin" : "Member"}
                    </h2>
                </div>

                <div className="detail">
                    <Statistic chosenListInMenu={tab} />
                </div>

            </div>

            <div className="admin_container">
                <div id="content">
                    <div id="menu">
                        <h1 className="menu_title" >DASH BOARD</h1>

                        <h3 className='menu_list_title'>Items, devices</h3>
                        <button
                            className={"menu_list_admin " + ((tab === "items" || !tab) && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "items"
                            })}
                        >
                            Items
                        </button>

                        <h3 className='menu_list_title'>Users</h3>
                        <button
                            className={"menu_list_admin " + (tab === "users" && type === "register" && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "users",
                                type: "register"
                            })}
                        >
                            Register users
                        </button>

                        <button
                            className={"menu_list_admin " + (tab === "users" && type === "member" && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "users",
                                type: "member"
                            })}
                        >
                            Member
                        </button>

                        <h3 className='menu_list_title'>Oders</h3>
                        <button
                            className={"menu_list_admin " + (tab === "orders" && type === "pending" && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "orders",
                                type: "pending"
                            })}
                        >
                            Pending orders
                        </button>

                        <button
                            className={"menu_list_admin " + (tab === "orders" && type === "accepted" && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "orders",
                                type: "accepted"
                            })}
                        >
                            Processing orders
                        </button>

                        <button
                            className={"menu_list_admin " + (tab === "orders" && type === "complete" && "chosen")}
                            onClick={() => setSearchParams({
                                tab: "orders",
                                type: "complete"
                            })}
                        >
                            Complete orders
                        </button>

                    </div>

                    <div id="list">
                        {(tab === "items" || !tab) && <Items />}

                        {
                            tab === "users" && type === "register" &&
                            <Users
                                enable={false}
                            />

                        }
                        {
                            tab === "users" && type === "member" &&
                            <Users
                                enable={true}
                            />
                        }
                        {
                            tab === "orders" && type === "pending" &&
                            <Orders
                                status={"pending"}
                            />
                        }
                        {
                            tab === "orders" && type === "accepted" &&
                            <Orders
                                status={"accepted"}
                            />
                        }
                        {
                            tab === "orders" && type === "complete" &&
                            <Orders
                                status={"complete"}
                            />
                        }


                    </div>
                </div>
            </div>

        </div>

    )
}