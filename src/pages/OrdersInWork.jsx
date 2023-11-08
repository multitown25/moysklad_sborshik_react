import React, { useEffect, useState } from 'react'
import OrderService from '../services/OrderService'
import MyButton from '../UI/MyButton/MyButton';

export default function OrdersInWork() {
    const [ordersInWork, setOrdersInWork] = useState([]);


    useEffect(() => {
        getAllOrdersInWork();
    }, [])

    async function getAllOrdersInWork() {
        const data = await OrderService.getAllOrdersInWork().then(data => data.data);
        setOrdersInWork(data);
    }

    if (ordersInWork.length === 0) {
        return null;
    }

    async function handleRemoveAllOrdersInWork() {
        for (let i = 0; i < ordersInWork.length; i++) {
            const removeOrderFromWork = await OrderService.removeOrderFromWork(ordersInWork[i].orderId, ordersInWork[i].userEmail);
            console.log(removeOrderFromWork);
        }
    }

    return (
        <div>
            <p><b>Заказы, которые сейчас собирают</b></p>
            {ordersInWork.length > 0
                ?
                ordersInWork.map(item => (
                    <p><b>{item.order}</b> {item.userEmail}</p>
                ))
                :
                ""}
            {/* {console.log(ordersInWork)} */}
            <MyButton onClick={handleRemoveAllOrdersInWork}>Удалить все заказы с работы</MyButton>
        </div>
    )
}
