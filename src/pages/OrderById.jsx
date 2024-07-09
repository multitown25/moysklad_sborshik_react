import React, {useEffect, useLayoutEffect, useState, useMemo, useReducer, useContext} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import OrderService from '../services/OrderService';
import {MaterialReactTable} from 'material-react-table';
import {Box, Button, ListItemIcon, MenuItem, Typography} from '@mui/material';
import {Context} from '../index';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import OrderList from "../components/OrderList";
import {toJS} from "mobx";
import MyButton from "../UI/MyButton/MyButton";

/**
 * выводить:
 * имя, дату, способ доставки, позиции
 * name, moment/created?, attributes.find(attribute => attribute.name == 'Способ доставки NEW').value, positions
 */

export default function OrderById() {
    const {store} = useContext(Context);
    const pagination = {
        pageSize: 100
    }
    const readyButtons = {
        'Упаковщик': 'УПАКОВАТЬ',
        'Сборщик': 'СОБРАТЬ'
    }
    const STATES = new Map([
        ['Сборщик', 'Собрано'],
        ['Упаковщик', 'Упаковано'],
        ['Разливщик масел', 'Готов к сборке']
    ])
    const [order, setOrder] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    let [barcodeParts, setBarcodeParts] = useState('');
    const [barcode, setBarcode] = useState({});
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const params = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [isWaitingButtonClicked, setIsWaitingButtonClicked] = useState(false);
    const [isCorrectButtonClicked, setIsCorrectButtonClicked] = useState(false);
    const [orderCorrectReason, setOrderCorrectReason] = useState("");
    const [orderWaitingReason, setOrderWaitingReason] = useState("");
    const navigate = useNavigate();
    const columns = useMemo(
        () => [
            {
                accessorKey: 'image',
                header: 'Изображение',
                size: 200,
                Cell: ({cell}) => (
                    <img
                        alt="No image"
                        src={cell.getValue()}/>
                )
            },
            {
                accessorKey: 'article',
                header: 'Артикул',
                size: 200
            },
            {
                accessorKey: 'name',
                header: 'Наименование',
                size: 200
            },
            {
                accessorKey: 'quantity',
                header: 'Количество',
                size: 200,
                Cell: ({cell}) => (
                    <span style={{fontSize: '20px'}}>
                        {cell.getValue()}
                    </span>
                )
            }
        ],
        [],
    );

    useEffect(() => {
        getOrderById(params.id);
        uploadSelectedRowsFromServer();

    }, [params.id])

    async function uploadSelectedRowsFromServer() {
        // let isUploaded = false;

        try {
            const response = await store.checkOrdersInWork();
            // isUploaded = true;

            const orderInStore = toJS(store.ordersInWork);
            const rowsToUpdate = orderInStore.find(item => item.id === params.id).selectedPositions;

            // for (let i = 0; i < order.positions.length; i++) {
            //     if (order.positions[i].toLowerCase().contains('масла')) {
            //         rowsToUpdate[i] = true;
            //     }
            // }

            console.log('order in store', rowsToUpdate)

            const selectedRow = Object.assign(rowSelection, rowsToUpdate);
            setRowSelection((selectedRow) => (selectedRow));
            // setRowSelection(selectedRow);

        } catch (e) {
            console.log(e);
        }


    }


    useEffect(() => {
        console.log(rowSelection);
        const orderInStoree = updateSelectedPositions();

    }, [rowSelection])

    async function updateSelectedPositions() {
        // // const orderInStore = toJS(store.ordersInWork).find(item => item.id === params.id);
        // const updatedIndicesArr = Object.keys(rowSelection);
        // console.log(rowSelection);
        // // console.log('orderId', order);
        // const updatedIndices = Object.assign({}, updatedIndicesArr);
        // console.log('updated indices', updatedIndices);
        //
        // let serverResToUpdateSelectedPositions;
        // if (updatedIndicesArr.length > 0) {
        //     console.log('update indices length', updatedIndicesArr.length);
        //     await OrderService.updateSelectedPositions(params.id, {updatedIndices});
        // }
        //
        // return serverResToUpdateSelectedPositions;

        const updateRows = Object.assign({}, rowSelection);
        console.log('updateRows', updateRows);
        let serverResToUpdateSelectedPositions;
        if (Object.keys(updateRows).length > 0) {
            await OrderService.updateSelectedPositions(params.id, {updateRows});
        }

        return serverResToUpdateSelectedPositions;

    }

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Enter') {
                setBarcode({value: parseScannedInput(barcodeParts)});
                setBarcodeParts('');
                return;
            }

            let newBarcode = barcodeParts.concat(e.key);
            setBarcodeParts(newBarcode);
        }

        document.addEventListener('keydown', handleKeyDown);

        // why?
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [barcodeParts]);

    useEffect(() => {
        if (order.length !== 0) {
            console.log('order', order);
            const needSelectRow = order.positions.find(position => position.barcode === barcode.value)?.id;
            console.log(barcode.value)
            console.log(needSelectRow);
            if (needSelectRow) {
                setBarcodeParts('');
                setShowPopup(!showPopup);
                // alert("Неверный штрихкод!")
                // document.getElementByClassName('MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation2 css-80pr5n-MuiPaper-root').focus();
                return;
            }

            const selectedRow = Object.assign(rowSelection, {[needSelectRow]: true})
            setRowSelection((selectedRow) => (selectedRow));
            console.log('selected row', selectedRow);
            console.log(barcode);
            console.log(rowSelection);
        }
        forceUpdate(); // функция, которая ререндерит компонент (если этого не делать, строка выделяется после второго пика или какого-либо другого действия на странице)
    }, [barcode])

    async function getOrderById(id) {
        let orderIsTaken = false;
        while (!orderIsTaken) {
            try {
                // const mappedPosition1 = positions.filter(position => position.assortment?.meta.type !== "service");
                // const mappedPosition = positions.filter(position => position.assortment?.meta.href !== "https://api.moysklad.ru/api/remap/1.2/entity/product/9a8d2bbf-8a73-11ec-0a80-0f0d000e5b0e"); // remove Доставка
                const response = await OrderService.getOrderById(id);
                console.log(response);

                // const reformattedData = await reformatDataOrder(response.data);
                setOrder(response.data);
                orderIsTaken = true;


            } catch (e) {
                console.log(e);
            }
        }

    }

    function parseScannedInput(input) {
        const matches = input.match(/Alt(\d+)/g);
        if (!matches) return input;

        return matches.map((code) => {
            const num = code.replace("Alt", "");
            return String.fromCharCode(parseInt(num));
        }).join('');
    }

    const handleSendToCorrect = async () => {
        try {
            // const addToDescription = `${order.description}\n${orderCorrectReason}`
            // const result = await OrderService.changeOrderStatus(params.id, 'Корректировка', addToDescription);

            const result = await OrderService.changeOrderStatus(params.id, 'Корректировка', orderCorrectReason);
            console.log(result);
            console.log(store.user.id);
            // const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.email);
            // console.log(removeOrderFromWork)
            const serverRes = await OrderService.moveOrderToWaitingList(params.id, 'correct', orderCorrectReason);
            alert(`Отгрузка ${order.name} успешно отправлена на корректировку!`)
            navigate('/start')

        } catch (error) {
            alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
        }

    };

    const handleToWaitingList = async () => {
        // const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id);
        // console.log(removeOrderFromWork)
        // console.log(order)
        const serverRes = await OrderService.moveOrderToWaitingList(params.id, 'waiting', orderWaitingReason);
        alert(`Отгрузка ${order.name} успешно отправлена в лист ожидания!`)
        navigate('/start');
        // localStorage.removeItem('orderId');
        // table.getSelectedRowModel().flatRows.map((row) => {
        //     alert('contact ' + row.getValue('name'));
        // });
    };


    return (
        <div>
            {order?.positions
                ?
                <MaterialReactTable columns={columns} data={order.positions}
                                    enableRowSelection
                                    onRowSelectionChange={setRowSelection}
                                    initialState={{pagination}}
                                    getRowId={(originalRow)=> originalRow.id}
                                    state={{rowSelection}}
                                    renderTopToolbarCustomActions={({table}) => {
                                        const handleCollectOrder = async () => {
                                            try {
                                                const result = await OrderService.changeOrderStatus(params.id, STATES.get(store.user.position));
                                                console.log(result);
                                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.position);
                                                console.log(removeOrderFromWork)
                                                // const addSborshikToOrder = await OrderService.addUserInfoToOrder(params.id, store.user.email, store.user.position);
                                                alert(`Отгрузка ${order.name} переведена на статус ${STATES.get(store.user.position)}!`)
                                                navigate('/start')
                                                // перекинуть на другой заказ
                                                // table.getSelectedRowModel().flatRows.map((row) => {
                                                //     alert('deactivating ' + row.getValue('name'));
                                                // });
                                            } catch (error) {
                                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                                            }

                                        };

                                        const handleToSendToRazliv = async () => {
                                            try {
                                                const result = await OrderService.changeOrderStatus(params.id, 'Розлив');
                                                console.log(result);
                                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.position);
                                                console.log(removeOrderFromWork)
                                                // const addSborshikToOrder = await OrderService.addSborshikToOrder(params.id, store.user.email);
                                                alert(`Отгрузка ${order.name} переведена на статус РАЗЛИВ МАСЕЛ!`)
                                                navigate('/start')
                                                // перекинуть на другой заказ
                                                // table.getSelectedRowModel().flatRows.map((row) => {
                                                //     alert('deactivating ' + row.getValue('name'));
                                                // });
                                            } catch (error) {
                                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                                            }
                                        };

                                        return (
                                            <div>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    marginTop: 9,
                                                    marginLeft: 35
                                                }}>Комментарий: <b>{order.description}</b></div>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <Button
                                                        color="success"
                                                        disabled={!table.getIsAllRowsSelected()}
                                                        onClick={handleCollectOrder}
                                                        variant="contained"
                                                    >
                                                        {readyButtons[store.user.position]}
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        // disabled={!table.getIsSomeRowsSelected()}
                                                        onClick={() => setIsCorrectButtonClicked(true)}
                                                        variant="contained"
                                                    >
                                                        КОРРЕКТИРОВКА
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        // disabled={true}
                                                        onClick={() => setIsWaitingButtonClicked(true)}
                                                        variant="contained"
                                                    >
                                                        В ожидание
                                                    </Button>
                                                    {/*<Button*/}
                                                    {/*    color="warning"*/}
                                                    {/*    // disabled={true}*/}
                                                    {/*    onClick={handleToSendToRazliv}*/}
                                                    {/*    variant="contained"*/}
                                                    {/*>*/}
                                                    {/*    На разлив*/}
                                                    {/*</Button>*/}
                                                    {/*<Button*/}
                                                    {/*    color="warning"*/}
                                                    {/*    // disabled={true}*/}
                                                    {/*    onClick={() => setIsWaitingButtonClicked(true)}*/}
                                                    {/*    variant="contained"*/}
                                                    {/*>*/}
                                                    {/*    Мои заказы*/}
                                                    {/*</Button>*/}
                                                    {/* <input type='text' autoFocus></input> */}
                                                </div>
                                                <div style={{display: "flex"}}>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        marginTop: 9,
                                                        marginLeft: 35
                                                    }}>Отгрузка: <b>{order.name}</b></div>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        marginTop: 9,
                                                        marginLeft: 35
                                                    }}>Способ доставки: <b>{order.delivery}</b></div>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        marginTop: 9,
                                                        marginLeft: 35
                                                    }}>Заказ: <b>{order.orderName}</b></div>
                                                </div>

                                                {/* <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Комментарий: ${order.description}`}</div> */}
                                            </div>
                                        );
                                    }}
                />
                :
                ""}
            <Popup open={showPopup} onClose={() => setShowPopup(false)}><h4> Неверный штрихкод! </h4></Popup>
            <Popup open={isCorrectButtonClicked} onClose={() => setIsCorrectButtonClicked(false)}>
                <h2> Укажите причину корректировки </h2>
                <input
                    onChange={(e) => {
                        setOrderCorrectReason(e.target.value)
                    }}
                    name={"correct_reason"}
                    value={orderCorrectReason}
                    type="text"
                    placeholder='причина корректировки'
                />
                <MyButton onClick={() => handleSendToCorrect()}> Отправить </MyButton>
            </Popup>
            <Popup open={isWaitingButtonClicked} onClose={() => setIsWaitingButtonClicked(false)}>
                <h2> Укажите причину ожидания </h2>
                <input
                    onChange={(e) => {
                        setOrderWaitingReason(e.target.value)
                    }}
                    name={"waiting_reason"}
                    value={orderWaitingReason}
                    type="text"
                    placeholder='причина ожидания'
                />
                <MyButton onClick={() => handleToWaitingList()}> Отправить </MyButton>
            </Popup>
            {/* Loading component */}
        </div>
    )
}
