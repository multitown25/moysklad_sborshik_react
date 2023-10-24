import React, { useContext } from 'react'
import LoginForm from '../components/LoginForm'
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const {store} = useContext(Context)
    const navigate = useNavigate();

    return (
        <div>
            {store.isAuth
                ?
                 navigate('/start')   
                :
                <LoginForm />
            }
        </div>
    )
}
