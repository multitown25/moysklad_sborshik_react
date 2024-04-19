import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import MyButton from "../UI/MyButton/MyButton";
import OrderService from "../services/OrderService";
import {toJS} from "mobx";
import {Context} from "../index";

export default function OrderItem(props) {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const handleSetOrderInWork = async () => {
        const orderId = props.order.id;
        console.log(toJS(store.ordersInWork));
        const currentOrders = toJS(store.ordersInWork).map(item => {
            if (item.id === orderId) {
                item.current = true;
            }
            return item;
        });
        await store.setOrdersInWork(currentOrders);

        // const serverRes = await OrderService.setOrderInWork(orderId);
        console.log(toJS(store.ordersInWork));
        navigate(`/orders/${orderId}`);
    }

    return (
        <div>
            <div>
                {/*<Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>*/}
                <MyButton onClick={handleSetOrderInWork}> {props.order.name} </MyButton> {props.order.waitingReason}
                {/*<MyButton onClick={() => navigate('/start')}>MAIN</MyButton>*/}
            </div>
            <div>
            </div>
        </div>
    )
}


