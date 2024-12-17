import React, {useContext, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from '../index';
import OrderService from '../services/OrderService';
import MyButton from '../UI/MyButton/MyButton';
import Popup from "reactjs-popup";
import EntityList from "../components/EntityList";
import {toJS} from "mobx";
import {MaterialReactTable} from "material-react-table";
import DemandService from "../services/DemandService";

export default function Start() {
    const {store} = useContext(Context);
    const [entities, setEntities] = useState([]);
    const [order, setOrder] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [showWaitingList, setShowWaitingList] = useState(false);
    const [showScanPopup, setShowScanPopup] = useState(false);
    const showScanPopupRef = useRef();
    showScanPopupRef.current = showScanPopup;
    const [showOrderList, setShowOrderList] = useState(false);
    let [barcodeParts, setBarcodeParts] = useState('');
    const [barcode, setBarcode] = useState({});
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const navigate = useNavigate();
    const labelRef = useRef(null);

    const pagination = {
        pageSize: 100
    }
    const columnsWithDemand = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Отгрузка',
                size: 200
            },
            {
                accessorKey: 'customerorderName',
                header: 'Заказ покупателя',
                size: 200
            },
            {
                accessorFn: (row) => {
                    const RED_ZONE_ORDERS_DATE = new Date();
                    // RED_ZONE_ORDERS_DATE.setDate(RED_ZONE_ORDERS_DATE.getDate() - 1);

                    const orderDate = new Date(row.created);
                    // console.log('RED ZONE DATE', RED_ZONE_ORDERS_DATE);
                    // console.log('order date', orderDate)

                    const diffInMs = RED_ZONE_ORDERS_DATE - orderDate;
                    const diffInHours = diffInMs / (1000 * 60 * 60);
                    return diffInHours.toFixed(2);
                },
                id: 'created',
                header: 'Часов в работе',
                size: 200
            }
        ],
        [],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Заказ покупателя',
                size: 200
            },
            {
                accessorFn: (row) => {
                    const RED_ZONE_ORDERS_DATE = new Date();
                    // RED_ZONE_ORDERS_DATE.setDate(RED_ZONE_ORDERS_DATE.getDate() - 1);

                    const orderDate = new Date(row.created);
                    // console.log('RED ZONE DATE', RED_ZONE_ORDERS_DATE);
                    // console.log('order date', orderDate)

                    const diffInMs = RED_ZONE_ORDERS_DATE - orderDate;
                    const diffInHours = diffInMs / (1000 * 60 * 60);
                    return diffInHours.toFixed(2);
                },
                id: 'created',
                header: 'Часов в работе',
                size: 200
            }
        ],
        [],
    );

    // is it necessary?
    // useEffect(() => {
    //     // getAllOrders();
    // }, []);

    useEffect(() => {
        getAllEntities();
    }, [])

    useEffect(() => {
        // store.checkOrdersInWork();
        // didBlurSubscription();
        // didBlurSubscription.remove();
        // labelRef.current.focus();
        // document.getElementById('welcomeLabel').focus();
    }, []);

    let inputBuffer = [];
    const ignoredKeys = ['NumLock', 'Enter'];
    // нужен ли мне вообще useState с barcode? Возможно достаточно переменной в этом useEffect
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Enter' && showScanPopupRef?.current) {
                // console.log(showScanPopupRef);
                // console.log(inputBuffer);
                const newBarcode = parseScannedInput(inputBuffer.join(''))
                setBarcode({value: newBarcode});
                console.log("SCANNED BARCODE1: ", newBarcode);

                inputBuffer = [];

                // setBarcodeParts('');
                if (newBarcode?.startsWith('o')) {
                    console.log("SCANNED BARCODE2: ", newBarcode);
                    // update user orders in work?
                    chooseOrder(newBarcode);
                }
                return;
            }


            if (!ignoredKeys.includes(e.key)) {
                inputBuffer.push(e.key);
            }
            // console.log(inputBuffer);

            // let newBarcode = barcodeParts.concat(e.key);
            // setBarcodeParts(newBarcode);
            // forceUpdate(); // функция, которая ререндерит компонент (если этого не делать, строка выделяется после второго пика или какого-либо другого действия на странице)
        }

        document.addEventListener('keydown', handleKeyDown);

        // why?
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    // useEffect(() => {
    //     forceUpdate(); // функция, которая ререндерит компонент (если этого не делать, строка выделяется после второго пика или какого-либо другого действия на странице)
    // }, [barcode])

    // useEffect(() => {
    //     if (store.user.email === undefined || store.user.email == "undefined") {
    //         alert('Пожалуйста, авторизуйтесь!');
    //         navigate('/login');
    //     }
    // }, []);

    async function chooseOrder(orderNumber) {
        const order = await OrderService.getOrderByOrderNumber(orderNumber);
        console.log(order.data);
        setOrder(order.data);
        setShowOrderList(true);
    }

    function parseScannedInput(input) {
        const matches = input.match(/Alt(\d+)/g);
        if (!matches) return input;

        return matches.map((code) => {
            const num = code.replace("Alt", "");
            return String.fromCharCode(parseInt(num));
        }).join('');
    }

    function isOrderInRedZone(orderDateStr) {
        const RED_ZONE_ORDERS_DATE = new Date();
        // RED_ZONE_ORDERS_DATE.setDate(RED_ZONE_ORDERS_DATE.getDate() - 1);

        const orderDate = new Date(orderDateStr);
        // console.log('RED ZONE DATE', RED_ZONE_ORDERS_DATE);
        // console.log('order date', orderDate)

        const diffInMs = RED_ZONE_ORDERS_DATE - orderDate;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        const res = diffInHours >= 24;
        // console.log(diffInHours);
        return res

    }

    // (NEW) start to collect
    async function startToCollect() {
        // console.log('NEW FUNC')
        // before check current orders
        await store.checkEntitiesInWork();

        // if user has current order (to collect) navigate him to it
        const userDemandsInWork = toJS(store.entitiesInWork);
        // console.log('start to collect, toJS(store.orderInWork)', userOrdersInWork);
        const hasCurrent = userDemandsInWork.find(item => item.current === true);
        if (hasCurrent) {
            const url = `/demand/${hasCurrent.id}`;
            // console.log(url);
            navigate(url);
        }

        // else give him new order to collect
        // if we got order then add this order to orders in work on server side and client side
        const newDemand = await DemandService.getNewDemand().then(data => {
            console.log(data);
            return data.data;
        });
        if (!newDemand) {
            alert('Нет отгрузок! Обратитесь к главному!')
            return;
        }

        userDemandsInWork.push(newDemand);
        // console.log('check client userOrdersInWork before set to store', userOrdersInWork)
        store.setEntitiesInWork(userDemandsInWork);
        const url = `/demand/${newDemand.id}`;
        console.log(url);
        navigate(url);
    }

    async function handleShowMyOrders() {
        await store.checkEntitiesInWork();
        setShowWaitingList(true);
    }

    function handleLogout() {
        navigate('/login')
    }

    function handleAllOrders() {
        navigate('/orders')
    }

    function handleAllOrdersInWork() {
        navigate('/ordersinwork')
    }


    async function getAllEntities() {
        try {
            let response;
            if (store.user.position === 'Сборщик') {
                response = await OrderService.getAllOrders();
            } else if (store.user.position === 'Упаковщик') {
                response = await DemandService.getAllDemands();
            } else {
                response = await OrderService.getAllOrders();
            }
            // console.log('ALL ORDERS BY USER TYPE\n', response.data);
            setEntities(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div>
            {entities
                ?
                <div style={{display: "grid", width: "200px", gridTemplateColumns: "auto"}}>
                    <h3 id={'welcomeLabel'} ref={labelRef}>{`Добро пожаловать, ${store.user.email}!`}</h3>
                    {/* <Link to={`/orders/${orderId}`}>Начать собирать</Link> */}

                    {store.user.email !== "admin"
                        ?
                        <div style={{display: "grid", justifyContent: "center"}}>
                            {store.user.position === 'Упаковщик' ?
                                <MyButton onClick={startToCollect}>Новый заказ</MyButton>
                                :
                                ""}

                            {store.user.position === 'Сборщик' ?
                                <MyButton onClick={() => setShowScanPopup(true)}>Отсканировать заказ</MyButton>
                                :
                                ""}
                            <MyButton onClick={handleShowMyOrders}>Мои заказы</MyButton>
                            <div>
                                {/*<MyButton onClick={handleBackButton}>Назад</MyButton>*/}
                                <h3>Список текущих заказов</h3>
                                {entities
                                    ?
                                    <MaterialReactTable columns={store.user.position === 'Упаковщик' ? columnsWithDemand : columns} data={entities}
                                        //enableRowSelection
                                        //onRowSelectionChange={setRowSelection}
                                                        initialState={{pagination}}
                                        //state={{rowSelection}}
                                                        muiTableBodyRowProps={({row}) => ({
                                                            //conditionally style selected rows
                                                            sx: {
                                                                backgroundColor: isOrderInRedZone(row.original.created) ? '#f14545' : '#ffffff',
                                                            },
                                                        })}
                                                        renderTopToolbarCustomActions={({table}) => {
                                                            // const handleCollectOrder = async () => {
                                                            //     try {
                                                            //         const result = await OrderService.changeOrderStatus(params.id, 'Собрано');
                                                            //         console.log(result);
                                                            //         const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.email);
                                                            //         console.log(removeOrderFromWork)
                                                            //         const addSborshikToOrder = await OrderService.addSborshikToOrder(params.id, store.user.email);
                                                            //         alert(`Заказ ${order.name} переведен на статус ${'Собрано'}!`)
                                                            //         navigate('/start')
                                                            //         // перекинуть на другой заказ
                                                            //         // table.getSelectedRowModel().flatRows.map((row) => {
                                                            //         //     alert('deactivating ' + row.getValue('name'));
                                                            //         // });
                                                            //     } catch (error) {
                                                            //         alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                                                            //     }
                                                            //
                                                            // };


                                                        }}
                                    />
                                    :
                                    ""
                                    // <MyButton onClick={handleBackToStartButton}>На главную</MyButton>
                                }
                            </div>
                        </div>
                        :
                        ""

                    }
                    <Popup open={showWaitingList} onClose={() => setShowWaitingList(false)} modal> <EntityList
                        entities={store.entitiesInWork}
                        title="Список заказов в ожидании"/> </Popup>

                    <Popup open={showScanPopup} onClose={() => setShowScanPopup(false)} modal>
                        <h3>Отсканируйте штрихкод</h3>
                    </Popup>

                    <Popup open={showOrderList} onClose={() => setShowOrderList(false)} modal> <EntityList
                        entities={order}
                        title="Выберите заказ"/> </Popup>

                    {store.user.email === "admin"
                        ?
                        <div>
                            <MyButton onClick={handleAllOrders}>
                                Все заказы для сборки
                            </MyButton>
                            <MyButton onClick={handleAllOrdersInWork}>
                                Все заказы на сборке
                            </MyButton>
                        </div>
                        :
                        ""
                    }
                    <MyButton onClick={async () => {
                        await store.logout();
                        handleLogout();
                    }}>
                        Выйти
                    </MyButton>
                </div>
                :
                <div></div>
            }
        </div>
    )
}