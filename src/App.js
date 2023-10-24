import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import OrderService from "./services/OrderService";
import Button from "./components/Button";
import OrderItem from './components/OrderItem';
import OrderList from './components/OrderList';
import RegistrationForm from './components/RegistrationForm';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Login from './pages/Login';

const App = () => {
    const { store } = useContext(Context);
    // const [users, setUsers] = useState([])
    // const [orders, setOrders] = useState([]);
    const [orders1, , setOrders1] = useState([
        { id: 1, number: 100 },
        { id: 2, number: 200 }
    ])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }

        // getOrders();
    }, [])


    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <Login />
                {/* <OrderList orders={orders1} title="TEST"/>
                <button onClick={getOrders}>GET ORDERS</button> */}
                {/* <button onClick={getOrders}>Получить список заказов</button> */}
            </div>
        );
    }

    return (

            <AppRouter/>
            // {/* isAuth? */}
            // {/* <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} /> */} 


            //     {/* <h1>{store.isAuth ? `Добро пожаловать, ${store.user.email}!` : 'АВТОРИЗУЙТЕСЬ'}</h1> */}
            //     {/* сразу же падает заказ для сборки */}
            //     {/* <button onClick={() => store.logout()}>Выйти</button>
            // <div>
            //     <button onClick={getOrders}>Получить список заказов</button>
            // </div> */}
            //     {/* {orders.length !== 0
            //     ? <OrderList orders={orders} title="orders ms"/>
            //     : <div>Нет заказов</div>
            // } */}



    );
};

export default observer(App);