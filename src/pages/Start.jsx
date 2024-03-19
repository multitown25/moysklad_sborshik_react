import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from '../index';
import OrderService from '../services/OrderService';
import MyButton from '../UI/MyButton/MyButton';
import Popup from "reactjs-popup";
import OrderList from "../components/OrderList";
import {toJS} from "mobx";

export default function Start() {
    const {store} = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [showWaitingList, setShowWaitingList] = useState(false);
    const navigate = useNavigate();


    // is it necessary?
    // useEffect(() => {
    //     // getAllOrders();
    // }, []);

    useEffect(() => {
        // store.checkOrdersInWork();
    }, []);

    // useEffect(() => {
    //     if (store.user.email === undefined || store.user.email == "undefined") {
    //         alert('Пожалуйста, авторизуйтесь!');
    //         navigate('/login');
    //     }
    // }, []);


    async function temp() {
        // const newOrder = await OrderService.getNewOrder().then(data => JSON.parse(data.data));

        const ordersInWork = await OrderService.getOrdersInWorkByUser(true).then(data => JSON.parse(data.data));
        // const currentOrderId = ordersInWork.find(item => item.current === true)?.id;
        const currentOrderId = ordersInWork.filter(item => item.employee === store.user.email).find(item => item.current === true)?.id;
        console.log(ordersInWork);
        if (ordersInWork.length === 0 || !currentOrderId) {
            console.log('handle new order')
            alert('Нет заказов! Обратитесь к главному!')
            return;
        }

        setOrderId(currentOrderId);
        store.setOrdersInWork(ordersInWork);
        const url = `/orders/${currentOrderId}`
        console.log(url)
        navigate(url)
    }

    // (NEW) start to collect
    async function startToCollect() {
        console.log('NEW FUNC')
        // before check current orders
        await store.checkOrdersInWork();

        // if user has current order (to collect) navigate him to it
        const userOrdersInWork = toJS(store.ordersInWork);
        console.log('start to collect, toJS(store.orderInWork)', userOrdersInWork);
        const hasCurrent = userOrdersInWork.find(item => item.current === true);
        if (hasCurrent) {
            const url = `/orders/${hasCurrent.id}`;
            console.log(url);
            navigate(url);
        }

        // else give him new order to collect
        // if we got order then add this order to orders in work on server side and client side
        const newOrder = await OrderService.getNewOrder().then(data => {
            console.log(data);
            return data.data;
        });
        if (!newOrder) {
            alert('Нет заказов! Обратитесь к главному!')
            return;
        }

        userOrdersInWork.push(newOrder);
        console.log('check client userOrdersInWork before set to store', userOrdersInWork)
        store.setOrdersInWork(userOrdersInWork);
        const url = `/orders/${newOrder.id}`;
        console.log(url);
        navigate(url);
    }

    async function handleShowMyOrders() {
        await store.checkOrdersInWork();
        setShowWaitingList(true);
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
            const response = await OrderService.getAllOrders();
            console.log('ALL ORDERS BY USER TYPE\n', response.data);
            setOrders(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div>
            {orders
                ?
                <div style={{display: "grid", width: "200px", gridTemplateColumns: "auto"}}>
                    <h3>{`Добро пожаловать, ${store.user.email}!`}</h3>
                    {/* <Link to={`/orders/${orderId}`}>Начать собирать</Link> */}

                    {store.user.email !== "admin"
                        ?
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <MyButton onClick={startToCollect}>Новый заказ</MyButton>
                            <MyButton onClick={handleShowMyOrders}>Мои заказы</MyButton>
                        </div>
                        :
                        ""

                    }

                    <Popup open={showWaitingList} onClose={() => setShowWaitingList(false)} modal> <OrderList
                        orders={store.ordersInWork}
                        title="Список заказов в ожидании"/> </Popup>


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