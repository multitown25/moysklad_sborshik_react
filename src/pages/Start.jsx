import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../index';
import OrderService from '../services/OrderService';

export default function Start() {
    const { store } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');

    // console.log(localStorage.getItem('orderId'));

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //       console.log('Timeout called!');
    //     }, 3000);
    //     return () => clearTimeout(timer);
    //   }, []);

    useEffect(() => {
        getAllOrders();
        // chooseRandomOrderId();
    }, []);

    useEffect(() => {
        // getAllOrders();
        orders.length !== 0 && chooseRandomOrderId();
    }, [orders]);



    async function getAllOrders() {
        try {
            const response = await OrderService.getAllOrders();
            console.log(response);
            setOrders(response.data);

            // const orderId = localStorage.getItem('orderId');
            // if (orderId == undefined || orderId == null || orderId == "") {
            //     console.log("FSDFDS")
            //     const randomIndex = Math.floor(Math.random() * (orders.length))
            //     const newOrderId = orders[randomIndex]?.id;
            //     localStorage.setItem('orderId', newOrderId)
            //     // store.setOrder(orderId);
            //     console.log(newOrderId);

            // } else {

            // }
            // const response = await axios.get('https://online.moysklad.ru/api/remap/1.2/entity/customerorder?filter=state.name=НА СБОРКЕ', config);
            // console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function chooseRandomOrderId() {
        const orderId = await OrderService.getOrderInWorkByUser(store.user.id).then(data => data.data);
        // setOrderId(orderId)
        console.log(orderId)


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
                    console.log(newOrderId)
                    // orderIsSelect = true;
                    // console.log(ordersInWork)
                    // const ordersInWorkArray = ordersInWork.data[0].order;
                    // const test = ordersInWork.data.filter(item => item.order.includes(item1 => item1 === newOrderId) === newOrderId);
                    // console.log(ordersInWorkArray);

                    // console.log(!ordersInWorkArray.find(item => item === newOrderId));
                    if (!ordersInWork.find(item => item.orderId === newOrderId)) {
                        console.log("NEW ORDER ID")
                        console.log(newOrderId)
                        const tryToSetOrderInWork = await OrderService.setOrderInWork(newOrderId, store.user.id);
                        // console.log(tryToSetOrderInWork);
                        setOrderId(newOrderId);
                        orderIsSelect = true;
                    }
                   counter++; 
                }

                if (counter === 3000) { // or if ordersInWork.length === orders.length
                    setOrderId(undefined);
                    alert("Нет заказов для сборки! Обратитесь к главному!");
                }

                // store.setOrder(orderId);
                // console.log(newOrderId);
                // return Promise.resolve(orderId);
            } else {
                // return Promise.resolve(orderId);
                setOrderId(orderId.orderId);
            }
        } catch (error) {
            console.log(error)
        }




    }

    return (
        <div>
            {orders
                ?
                <div>
                    <h3>{`Добро пожаловать, ${store.user.email}!`}</h3>
                    <Link to={`/orders/${orderId}`}>Начать собирать</Link>
                </div>
                :
                <div></div>
            }
        </div>
    )
    // const randomIndex = Math.floor(Math.random() * (numbers.length - 1))
}
