import React, {useState, useContext} from 'react'
import {Context} from '../index';

export default function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('');
    const {store} = useContext(Context);

    return (
        <div>
            <input
                type='text'
                value={email}
                placeholder='логин'
                onChange={event => setEmail(event.target.value)}
            />
            <input
                type="password"
                value={password}
                placeholder='пароль'
                onChange={event => setPassword(event.target.value)}
            />
            <input
                type="text"
                value={position}
                placeholder='должность'
                onChange={event => setPosition(event.target.value)}
            />
            <button onClick={() => {
                store.registration(email, password, position);
                setEmail('');
                setPassword('');
                setPosition('');
            }}>
                Регистрация
            </button>
        </div>
    )
}
