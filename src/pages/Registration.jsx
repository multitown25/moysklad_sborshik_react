import React, { useContext } from 'react'
import RegistrationForm from '../components/RegistrationForm'
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
    const { store } = useContext(Context)
    const navigate = useNavigate();

    return (
        <div>
            <RegistrationForm />
        </div>
    )
}
