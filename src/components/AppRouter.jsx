import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./LoginForm";
import OrderItem from './OrderItem';
import OrderList from './OrderList';
import RegistrationForm from './RegistrationForm';
import {observer} from "mobx-react-lite";
import { privateRoutes, publicRoutes } from '../router/index';
import { Context } from '../index';

const AppRouter = () => {
    const { store } = useContext(Context);
    // console.log(store.isLoading);
    // console.log(store.isAuth);
    // useEffect(() => {
    //     if (localStorage.getItem('token')) {
    //         store.checkAuth()
    //     }

    //     getOrders();
    // }, [])

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    return (
            store.isAuth
                ?
                <Routes>
                    {privateRoutes.map(route =>
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element/>}>
                        </Route>
                    )}
                    <Route path="*" element={<Navigate to='/start' replace />} />
                </Routes>
                :   
                <Routes>
                    {publicRoutes.map(route =>
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element/>}>    
                        </Route>
                    )}
                    {/* <Route path="/orders" element={<OrderList />}/> */}
                    <Route path="*" element={<Navigate to='/login' replace />} />
                </Routes>

            // {/* navigate error ? */}
            // {/* <Navigate to="/login" element={<LoginForm />} /> */}
            // {/* isAuth? */}
            // {/* <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} /> */}
    )
}

export default observer(AppRouter);
