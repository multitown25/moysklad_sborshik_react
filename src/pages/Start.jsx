import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../index';
import OrderService from '../services/OrderService';
import MyButton from '../UI/MyButton/MyButton';

export default function Start() {
    const { store } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        getAllOrders();
        // chooseRandomOrderId();
    }, []);


    async function handleNewOrder() {
        const orderForWork = await chooseRandomOrderId();
        console.log(orderForWork)
        // console.log(Object.entries(orderForWork))
        if (orderForWork == 'undefined' || orderForWork == null) {
            console.log('handle new order')
            alert('Нет заказов! Обратитесь к главному!')
            const removeOrderFromWork = await OrderService.removeOrderFromWork("undefined", store.user.email);
            console.log(removeOrderFromWork);
            return;
        }
        const url = `/orders/${orderForWork}`
        console.log(url)
        navigate(url)
    }

    function handleLogout() {
        navigate('/login')
    }

    function handleAllOrders() {
        navigate('/orders')
    }

    function handleAllOrdersInWork() {
        navigate('/ordersinwork')
    }

    async function getAllOrders() {
        try {
            let neededStatus;
            console.log(store.isSborshik);
            if (store.isSborshik) {
                neededStatus = 'НА СБОРКЕ';
            } else {
                neededStatus = 'НА УПАКОВКЕ'
            }
            // console.log(neededStatus);
            const response = await OrderService.getAllOrders(neededStatus);
            // console.log(response);
            setOrders(response.data);
            console.log(orders);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function chooseRandomOrderId() {
        console.log(store.user.email)
        const orderId = await OrderService.getOrderInWorkByUser(store.user.email).then(data => data.data);
        console.log(orderId)
        console.log(orders?.positions)


        try {
            if (orderId === undefined || orderId === null || orderId === "undefined" || orderId === "") {
                let orderIsSelect = false;
                let counter = 0;
                const ordersInWork = await OrderService.getAllOrdersInWork().then(data => data.data);
                console.log(ordersInWork);

                while (!orderIsSelect && counter !== 3000) {
                    // await sleep(2000);
                    const randomIndex = Math.floor(Math.random() * (orders.length))
                    const newOrderId = orders[randomIndex]?.id;
                    const newOrderName = orders[randomIndex]?.name;
                    console.log(newOrderId)

                    // console.log(!ordersInWorkArray.find(item => item === newOrderId));
                    if (!ordersInWork.find(item => item.orderId === newOrderId) && newOrderId != undefined) {
                        console.log("NEW ORDER ID")
                        console.log(newOrderId)
                        const tryToSetOrderInWork = await OrderService.setOrderInWork(newOrderId, store.user.email, newOrderName);
                        // console.log(tryToSetOrderInWork);
                        setOrderId(newOrderId);
                        return newOrderId;
                        orderIsSelect = true;
                    }
                    counter++;
                }

            } else {
                // return Promise.resolve(orderId);
                setOrderId(orderId.orderId);
                return orderId.orderId;
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {orders
                ?
                <div style={{ display: "grid", width: "200px", gridTemplateColumns: "auto" }}>
                    <h3>{`Добро пожаловать, ${store.user.email}!`}</h3>
                    {/* <Link to={`/orders/${orderId}`}>Начать собирать</Link> */}

                    {store.user.email !== "admin"
                        ?
                        <MyButton onClick={handleNewOrder}>Начать собирать</MyButton>
                        :
                        ""
                    }

                    {store.user.email === "admin"
                        ?
                        <div>
                            <MyButton onClick={handleAllOrders}>
                                Все заказы для сборки
                            </MyButton>
                            <MyButton onClick={handleAllOrdersInWork}>
                                Все заказы на сборке
                            </MyButton>
                        </div>
                        :
                        ""
                    }

                    <MyButton onClick={async () => {
                        await store.logout();
                        handleLogout();
                    }}>
                        Выйти
                    </MyButton>

                </div>
                :
                <div></div>
            }
        </div>
    )
}
