import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderItem(props) {

    return (
        <div>
            <div>
                <Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>
            </div>
            <div>
            </div>
        </div>
    )
}


