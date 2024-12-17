import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {observer} from "mobx-react-lite";
import { privateRoutes, publicRoutes } from '../router/index';
import { Context } from '../index';

const AppRouter = () => {
    const { store } = useContext(Context);

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    return (
            store.user.email === "admin"
                ?
                <Routes>
                    {privateRoutes.map(route =>
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element/>}>
                        </Route>
                    )}
                    {/* <Route path="*" element={<Navigate to='/start' replace />} /> */}
                    {console.log("private routes")}
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
                    {/* <Route path="/orders" element={<EntityList />}/> */}
                    {/*<Route path="*" element={<Navigate to='/login' replace />} />*/}
                    
                </Routes>
    )
}

export default observer(AppRouter);
