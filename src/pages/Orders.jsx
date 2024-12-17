import React, {useState, useEffect, useContext, useMemo} from 'react'
import EntityList from '../components/EntityList';
import OrderService from '../services/OrderService';
import MyButton from '../UI/MyButton/MyButton';
import {useNavigate, useParams} from 'react-router-dom';
import { Context } from '../index';
import {Button} from "@mui/material";
import {MaterialReactTable} from "material-react-table";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const pagination = {
        pageSize: 100
    }
    const params = useParams();
    const [rowSelection, setRowSelection] = useState({});
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Номер',
                size: 200
            },
            {
                accessorKey: 'status',
                header: 'Статус',
                size: 200
            }
        ],
        [],
    );

    useEffect(() => {
        getAllOrders();
    }, [])

    
    async function getAllOrders() {
        try {
            const response = await OrderService.getAllOrders();
            console.log(response);
            // const onlyKazanOrders = response.data.filter(order => order.store.meta.href === "https://api.moysklad.ru/api/remap/1.2/entity/store/be01fcbe-5120-11ec-0a80-0562002b7e32");
            setOrders(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    function handleBackButton() {
        navigate('/start');
    }

    return (
        <div>
            <MyButton onClick={handleBackButton}>Назад</MyButton>
            <h3>Список текущих заказов</h3>
            {orders
            ?
            <MaterialReactTable columns={columns} data={orders}
                                enableRowSelection
                                onRowSelectionChange={setRowSelection}
                                initialState={{pagination}}
                                state={{rowSelection}}
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
                                    //
                                    //
                                    // const handleToWaitingList = async () => {
                                    //     // const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id);
                                    //     // console.log(removeOrderFromWork)
                                    //     // console.log(order)
                                    //     const serverRes = await OrderService.moveOrderToWaitingList(params.id);
                                    //     alert(`Заказ ${order.name} успешно отправлен в лист ожидания!`)
                                    //     navigate('/start');
                                    //     // localStorage.removeItem('orderId');
                                    //     // table.getSelectedRowModel().flatRows.map((row) => {
                                    //     //     alert('contact ' + row.getValue('name'));
                                    //     // });
                                    // };
                                    //
                                    // return (
                                    //     <div>
                                    //         <div style={{
                                    //             display: "flex",
                                    //             justifyContent: "center",
                                    //             marginTop: 9,
                                    //             marginLeft: 35
                                    //         }}>Комментарий: <b>{order.description}</b></div>
                                    //         <div style={{display: 'flex', gap: '0.5rem'}}>
                                    //             <Button
                                    //                 color="success"
                                    //                 disabled={!table.getIsAllRowsSelected()}
                                    //                 onClick={handleCollectOrder}
                                    //                 variant="contained"
                                    //             >
                                    //                 СОБРАТЬ
                                    //             </Button>
                                    //             <Button
                                    //                 color="error"
                                    //                 // disabled={!table.getIsSomeRowsSelected()}
                                    //                 onClick={() => setIsCorrectButtonClicked(true)}
                                    //                 variant="contained"
                                    //             >
                                    //                 КОРРЕКТИРОВКА
                                    //             </Button>
                                    //             <Button
                                    //                 color="primary"
                                    //                 // disabled={true}
                                    //                 onClick={handleToWaitingList}
                                    //                 variant="contained"
                                    //             >
                                    //                 В ожидание
                                    //             </Button>
                                    //             <Button
                                    //                 color="warning"
                                    //                 // disabled={true}
                                    //                 onClick={() => setIsWaitingButtonClicked(true)}
                                    //                 variant="contained"
                                    //             >
                                    //                 Мои заказы
                                    //             </Button>
                                    //             {/* <input type='text' autoFocus></input> */}
                                    //         </div>
                                    //         <div style={{display: "flex"}}>
                                    //             <div style={{
                                    //                 display: "flex",
                                    //                 justifyContent: "center",
                                    //                 marginTop: 9,
                                    //                 marginLeft: 35
                                    //             }}>Заказ: <b>{order.name}</b></div>
                                    //             <div style={{
                                    //                 display: "flex",
                                    //                 justifyContent: "center",
                                    //                 marginTop: 9,
                                    //                 marginLeft: 35
                                    //             }}>Способ доставки: <b>{order.delivery}</b></div>
                                    //         </div>
                                    //
                                    //         {/* <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Комментарий: ${order.description}`}</div> */}
                                    //     </div>
                                    // );
                                }}
            />
            :
                ""
            // <MyButton onClick={handleBackToStartButton}>На главную</MyButton>
            }
        </div>
    )
}
