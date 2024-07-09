import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import MyButton from "../UI/MyButton/MyButton";
import classes from '../UI/MyButton/MyButton.module.css';
import OrderService from "../services/OrderService";
import {toJS} from "mobx";
import {Context} from "../index";

export default function OrderItem(props) {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const handleSetOrderCurrentTrue = async () => {
        const orderId = props.order.id;
        console.log(toJS(store.ordersInWork));
        const currentOrders = toJS(store.ordersInWork).map(item => {
            if (item.id === orderId) {
                item.current = true;
            }
            return item;
        });
        await store.setOrdersInWork(currentOrders); // remove await?

        // const serverRes = await OrderService.setOrderInWork(orderId);
        console.log(toJS(store.ordersInWork));
        navigate(`/orders/${orderId}`);
    }

    const handleSetOrderInWork = async () => {
        const orderId = props.order.id;
        // await store.checkOrdersInWork();
        const currentOrders = toJS(store.ordersInWork);
        const newOrder = await OrderService.getNewOrder({orderId}).then(data => {
            console.log(data);
            return data.data;
        });
        currentOrders.push(newOrder);
        store.setOrdersInWork(currentOrders);
        navigate(`/orders/${newOrder.id}`);
    }

    return (
        <div>
            {props.order.hasOwnProperty('isAvailable') ?
                props.order.isAvailable ?
                        <div>
                            <MyButton className={classes.myBtnAvailable}
                                      onClick={handleSetOrderInWork}> {props.order.name} </MyButton> <span>доступно</span>
                        </div>
                        :
                    <div>
                        {/*<Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>*/}
                        <MyButton className={classes.myBtnNotAvailable}> {props.order.name} </MyButton> <span>недоступно</span>
                    </div>
                :
                props.order.waiting ?
                        <div>
                            <MyButton className={classes.myBtnWaiting}
                                      onClick={handleSetOrderCurrentTrue}> {props.order.customerorderName} {props.order.name} </MyButton> {props.order.waiting}
                        </div>
                        :
                        <div>
                            {/*<Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>*/}
                            <MyButton className={classes.myBtnCorrect}
                                      onClick={handleSetOrderCurrentTrue}> {props.order.customerorderName} {props.order.name} </MyButton> {props.order.correct}
                            {/*<MyButton onClick={() => navigate('/start')}>MAIN</MyButton>*/}
                        </div>
            }
            <div>
            </div>
        </div>
    )
}


