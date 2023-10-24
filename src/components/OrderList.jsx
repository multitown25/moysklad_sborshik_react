import React from 'react'
import OrderItem from './OrderItem'

export default function OrderList({orders, title}) {
    return (
        <div>
            <h2>{title}</h2>
            {orders.map( (order, index) => {
                return <OrderItem order={order} key={order.id} index={index}/>
            })}
        </div>
    )
}
