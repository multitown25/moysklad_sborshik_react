import React, { useEffect, useState, useMemo, useReducer, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import OrderService from '../services/OrderService';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Context } from '../index';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

/**
 * выводить:
 * имя, дату, способ доставки, позиции
 * name, moment/created?, attributes.find(attribute => attribute.name == 'Способ доставки NEW').value, positions
 */

export default function OrderById() {
    const { store } = useContext(Context);
    const pagination = {
        pageSize: 100
    }
    const [order, setOrder] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const sborshiks = ["Татьяна", "Наталья", "Светлана", "Олег"]
    let [barcodeParts, setBarcodeParts] = useState('');
    const [barcode, setBarcode] = useState({});
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const params = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const columns = useMemo(
        () => [
            {
                accessorKey: 'image',
                header: 'Изображение',
                size: 200,
                Cell: ({ cell }) => (
                    <img
                        alt="No image"
                        src={cell.getValue()} />
                )
            },
            {
                accessorKey: 'article',
                header: 'Артикул',
                size: 200
            },
            {
                accessorKey: 'quantity',
                header: 'Количество',
                size: 200
            }
        ],
        [],
    );

    useEffect(() => {
        getOrderById(params.id);
    }, [])

    useEffect(() => {
        console.log(rowSelection)
    }, [rowSelection])

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Enter') {
                setBarcode({ value: parseScannedInput(barcodeParts) });
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
            const needSelectRowIndex = order.positions.findIndex(position => position.barcode === barcode.value);
            console.log(barcode.value)
            console.log(needSelectRowIndex);
            if (needSelectRowIndex === -1) {
                setBarcodeParts('');
                setShowPopup(!showPopup);
                // alert("Неверный штрихкод!")
                // document.getElementByClassName('MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation2 css-80pr5n-MuiPaper-root').focus();
                return;
            }

            const selectedRow = Object.assign(rowSelection, { [needSelectRowIndex]: true })
            setRowSelection((selectedRow) => (selectedRow));
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


    return (
        <div>
            {order?.positions
                ?
                <MaterialReactTable columns={columns} data={order.positions}
                    enableRowSelection
                    onRowSelectionChange={setRowSelection}
                    initialState={{pagination}}
                    state={{ rowSelection }}
                    renderTopToolbarCustomActions={({ table }) => {
                        const handleCollectOrder = async () => {
                            try {
                                let statusToChange;
                                if (!store.isSborshik) {
                                    statusToChange = 'Собрано'
                                } else {
                                    statusToChange = 'НА УПАКОВКЕ'
                                }
                                const result = await OrderService.changeOrderStatus(params.id, statusToChange);
                                console.log(result);
                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.email);
                                console.log(removeOrderFromWork)
                                const addSborshikToOrder = await OrderService.addSborshikToOrder(params.id, store.user.email);
                                alert(`Заказ ${order.name} переведен на статус ${statusToChange}!`)
                                navigate('/start')
                                // перекинуть на другой заказ
                                // table.getSelectedRowModel().flatRows.map((row) => {
                                //     alert('deactivating ' + row.getValue('name'));
                                // }); 
                            } catch (error) {
                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                            }

                        };

                        const handleSendToCorrect = async () => {
                            try {
                                const result = await OrderService.changeOrderStatus(params.id, 'Корректировка');
                                console.log(result);
                                console.log(store.user.id)
                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.email);
                                console.log(removeOrderFromWork)
                                alert(`Заказ ${order.name} успешно отправлен на корректировку!`)
                                navigate('/start')
                                // table.getSelectedRowModel().flatRows.map((row) => {
                                //     alert('activating ' + row.getValue('name'));
                                // });
                            } catch (error) {
                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                            }

                        };

                        const handleContact = async () => {
                            const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id);
                            console.log(removeOrderFromWork)
                            localStorage.removeItem('orderId');
                            // table.getSelectedRowModel().flatRows.map((row) => {
                            //     alert('contact ' + row.getValue('name'));
                            // });
                        };

                        return (
                            <div style={{ display: "flex" }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        color="success"
                                        disabled={!table.getIsAllRowsSelected()}
                                        onClick={handleCollectOrder}
                                        variant="contained"
                                    >
                                        СОБРАТЬ/УПАКОВАТЬ
                                    </Button>
                                    <Button
                                        color="error"
                                        // disabled={!table.getIsSomeRowsSelected()}
                                        onClick={handleSendToCorrect}
                                        variant="contained"
                                    >
                                        КОРРЕКТИРОВКА
                                    </Button>
                                    <Button
                                        color="error"
                                        disabled={true}
                                        onClick={handleContact}
                                        variant="contained"
                                    >
                                        Нет товара?
                                    </Button>
                                    {/* <input type='text' autoFocus></input> */}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>Текущий заказ: <b>{order.name}</b></div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>Способ доставки: <b>{order.delivery}</b></div>
                                {/* <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Комментарий: ${order.description}`}</div> */}
                            </div>

                        );
                    }}
                />
                :
                ""}
            <Popup open={showPopup} onClose={() => setShowPopup(false) }><h4> Неверный штрихкод! </h4></Popup>
            {/* Loading component */}
        </div>
    )
}
