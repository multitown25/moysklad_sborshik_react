import React, { useState } from 'react'

export default function Button() {
    const [counter, setCounter] = useState(3);
    const [value, setValue] = useState("defalut value");

    function increment() {
        setCounter(counter + 1);
    }

    function decrement() {
        setCounter(counter - 1);
    }

    return (
        <div>
            <h1>{counter}</h1>
            <h2>{value}</h2>
            <input 
                type='text'
                value={value}
                onChange={event => setValue(event.target.value)}
            />
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    )
}
