import React from 'react';
import classes from './MyButton.module.css';

const MyButton = ({className, children, ...props}) => {
    return (
        <button className={className ? className : classes.myBtn} {...props}>
            {children}
        </button>
    );
};

export default MyButton;