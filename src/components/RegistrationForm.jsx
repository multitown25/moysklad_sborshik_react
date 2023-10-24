import React, { useState, useContext } from 'react'
import { Context } from '../index';

export default function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {store} = useContext(Context);

    return (
      <div>
        <input
          type='text'
          value={email}
          placeholder='email'
          onChange={event => setEmail(event.target.value)}
        />
        <input 
          type="password"
          value={password}
          placeholder='password'
          onChange={event => setPassword(event.target.value)}
        />
        <button onClick={() => {
          store.registration(email, password);
          setEmail("");
          setPassword("");
        }}>
            Регистрация
        </button>
      </div>
    )
}
