import React, {useState, useEffect, useContext} from 'react'
import OrderList from '../components/OrderList';
import OrderService from '../services/OrderService';
import MyButton from '../UI/MyButton/MyButton';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { store } = useContext(Context);

    useEffect(() => {
        getAllOrders();
    }, [])

    
    async function getAllOrders() {
        try {
            // let neededStatus;
            // if (store.user.isSborshik || store.user.email == "admin") {
            //     neededStatus = 'НА СБОРКЕ';
            // } else {
            //     neededStatus = 'НА УПАКОВКЕ'
            // }
            console.log('НА СБОРКЕ');
            const response = await OrderService.getAllOrders('НА СБОРКЕ');
            console.log(response);
            // const onlyKazanOrders = response.data.filter(order => order.store.meta.href === "https://api.moysklad.ru/api/remap/1.2/entity/store/be01fcbe-5120-11ec-0a80-0562002b7e32");
            setOrders(response.data);
            // const response = await axios.get('https://online.moysklad.ru/api/remap/1.2/entity/customerorder?filter=state.name=НА СБОРКЕ', config);
            // console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    function handleBackToStartButton() {
        navigate('/start')
    }

    return (
        <div>
            <OrderList orders={orders} title="Список заказов для сборки"/>
            <MyButton onClick={handleBackToStartButton}>На главную</MyButton>
        </div>
    )
}
