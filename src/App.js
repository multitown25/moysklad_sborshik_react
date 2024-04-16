import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import AppRouter from './components/AppRouter';

const App = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(process.env.REACT_APP_API_URL)
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }

        // getOrders();
    }, []);

    useEffect(() => {
        store.checkOrdersInWork();
    }, []);


    useEffect(() => {
        if (!store.isAuth) {
            console.log('NAVIGATE TO /login');
            navigate('/login');
        }
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