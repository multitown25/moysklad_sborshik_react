import React, {useState, useEffect} from 'react'
import OrderList from '../components/OrderList';
import OrderService from '../services/OrderService';


export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getAllOrders();
    }, [])

    
    async function getAllOrders() {
        try {
            const response = await OrderService.getAllOrders();
            console.log(response);
            setOrders(response.data);
            // const response = await axios.get('https://online.moysklad.ru/api/remap/1.2/entity/customerorder?filter=state.name=НА СБОРКЕ', config);
            // console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <OrderList orders={orders} title="Список заказов для сборки"/>
        </div>
    )
}
