import React, { useContext, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const {store} = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) navigate('/start')
    }, [store.user])

    return (
        <div>
             <LoginForm />
        </div>
    )
}
