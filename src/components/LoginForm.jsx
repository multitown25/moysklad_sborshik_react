import React, {useContext, useState} from 'react';

import {Context} from "../index";
import {observer} from "mobx-react-lite";
import MyButton from '../UI/MyButton/MyButton';

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {store} = useContext(Context);

    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Пароль'
            />
            <MyButton onClick={() => store.login(email, password)}>
                Логин
            </MyButton>

        </div>
    );
};

export default observer(LoginForm);