import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from "./store/store";
import { BrowserRouter } from 'react-router-dom';

export const store = new Store();

export const Context = createContext({
    store,
})

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        store
    }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>

    </Context.Provider>
);