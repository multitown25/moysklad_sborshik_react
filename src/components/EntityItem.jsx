import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import MyButton from "../UI/MyButton/MyButton";
import classes from '../UI/MyButton/MyButton.module.css';
import OrderService from "../services/OrderService";
import {toJS} from "mobx";
import {Context} from "../index";
import DemandService from "../services/DemandService";

export default function EntityItem(props) {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const handleSetEntityCurrentTrue = async () => {
        const entityId = props.entity.id;
        console.log(toJS(store.entitiesInWork));
        const currentEntities = toJS(store.entitiesInWork).map(item => {
            if (item.id === entityId) {
                item.current = true;
            }
            return item;
        });
        await store.setEntitiesInWork(currentEntities); // remove await?

        // const serverRes = await OrderService.setOrderInWork(orderId);
        console.log(toJS(store.entitiesInWork));
        if (store.user.position === 'Сборщик') {
            navigate(`/orders/${entityId}`);
        } else if (store.user.position === 'Упаковщик') {
            navigate(`/demand/${entityId}`);
        } else {
            alert(`Должность пользователя: ${store.user.position}. Ошибка при навигации на его сущность..`)
        }
    }

    const handleSetEntityInWork = async () => {
        const entityId = props.entity.id;
        // await store.checkOrdersInWork();
        const currentEntities = toJS(store.entitiesInWork);

        if (store.user.position === 'Сборщик') {
            const newOrder = await OrderService.getNewOrder({orderId: entityId}).then(data => {
                console.log(data);
                return data.data;
            });
            currentEntities.push(newOrder);
            store.setEntitiesInWork(currentEntities);
            navigate(`/orders/${newOrder.id}`);
        } else if (store.user.position === 'Упаковщик') {
            const newDemand = await DemandService.getNewDemand({demandId: entityId}).then(data => {
                console.log(data);
                return data.data;
            });
            currentEntities.push(newDemand);
            store.setEntitiesInWork(currentEntities);
            navigate(`/demand/${newDemand.id}`);
        }
    }

    return (
        <div>
            {props.entity.hasOwnProperty('isAvailable') ?
                props.entity.isAvailable ?
                        <div>
                            <MyButton className={classes.myBtnAvailable}
                                      onClick={handleSetEntityInWork}> {props.entity.name} </MyButton> <span>доступно</span>
                        </div>
                        :
                    <div>
                        {/*<Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>*/}
                        <MyButton className={classes.myBtnNotAvailable}> {props.entity.name} </MyButton> <span>недоступно</span>
                    </div>
                :
                props.entity.waiting ?
                        <div>
                            <MyButton className={classes.myBtnWaiting}
                                      onClick={handleSetEntityCurrentTrue}> {props.entity.customerorderName} {props.entity.name} </MyButton> {props.entity.waiting}
                        </div>
                        :
                        <div>
                            {/*<Link to={`/orders/${props.order.id}`} >{props.order.name}</Link>*/}
                            <MyButton className={classes.myBtnCorrect}
                                      onClick={handleSetEntityCurrentTrue}> {props.entity.customerorderName} {props.entity.name} </MyButton> {props.entity.correct}
                            {/*<MyButton onClick={() => navigate('/start')}>MAIN</MyButton>*/}
                        </div>
            }
            <div>
            </div>
        </div>
    )
}


