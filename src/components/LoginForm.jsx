import React, {useContext, useState} from 'react';

import {Context} from "../index";
import {observer} from "mobx-react-lite";
import MyButton from '../UI/MyButton/MyButton';

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [position, setPosition] = useState('')
    const {store} = useContext(Context);

    const positions = [
        'Сборщик',
        'Упаковщик'
    ]

    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Логин'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Пароль'
            />
            {/*<input*/}
            {/*    onChange={e => setPosition(e.target.value)}*/}
            {/*    value={position}*/}
            {/*    type="text"*/}
            {/*    placeholder='Должность'*/}
            {/*/>*/}
            <select onChange={(e) => setPosition(e.target.value)}>
                <option>Выберите должность</option>
                {positions.map((position, index) => {
                    return (
                        <option key={index}>
                            {position}
                        </option>
                    );
                })}
            </select>
            <MyButton onClick={() => store.login(email, password, position)}>
                Войти
            </MyButton>

        </div>
    );
};

export default observer(LoginForm);