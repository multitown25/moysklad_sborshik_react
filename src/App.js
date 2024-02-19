import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Login from './pages/Login';

const App = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [orders1, , setOrders1] = useState([
        { id: 1, number: 100 },
        { id: 2, number: 200 }
    ])

    useEffect(() => {
        console.log(process.env.REACT_APP_API_URL)
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }

        // getOrders();
    }, [])

    useEffect(() => {
        if (!store.isAuth) navigate('/login');
    }, []) // [store.isAuth]


    if (store.isLoading) {
        return <div>Загрузка...</div>
    }


    return (
            <div>
                <AppRouter/>
            </div>

    );
};

export default observer(App);