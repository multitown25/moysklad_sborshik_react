import React, {useEffect, useState, useContext, useMemo} from 'react'
import OrderService from '../services/OrderService'
import { Context } from '../index'
import MyButton from '../UI/MyButton/MyButton';
import {MaterialReactTable} from "material-react-table";
import OrderList from "../components/OrderList";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

export default function OrdersInWork() {
    const [ordersInWork, setOrdersInWork] = useState([]);
    const { store } = useContext(Context);
    const navigate = useNavigate();
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
                accessorKey: 'employee',
                header: 'Сотрудник',
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
        getAllOrdersInWork();
    }, [])

    async function getAllOrdersInWork() {
        // const type =
        const data = await OrderService.getAllOrdersInWork().then(data => data.data);
        console.log(data)
        setOrdersInWork(data);
    }

    function refreshPage() {
        window.location.reload();
    }

    function handleRefreshPageButton() {

    }

    // if (ordersInWork.length === 0) {
    //     return null;
    // }

    function handleBackButton() {
        navigate('/start');
    }

    return (
        <div>
            <MyButton onClick={handleBackButton}>Назад</MyButton>
            <MyButton onClick={refreshPage}>Обновить</MyButton>
            {ordersInWork.length > 0
                ?
                <MaterialReactTable columns={columns} data={ordersInWork}
                                    enableRowSelection
                                    enableMultiRowSelection={false}
                                    onRowSelectionChange={setRowSelection}
                                    initialState={{pagination}}
                                    state={{rowSelection}}
                                    renderTopToolbarCustomActions={({table}) => {
                                        const handleRemoveOrderFromWork = async () => {
                                            try {
                                                const selectedOrdersIndices = Object.keys(rowSelection).map(item => parseInt(item));
                                                const ordersToRemove = [];
                                                selectedOrdersIndices.forEach(item => { // for multi delete feature
                                                    ordersToRemove.push(ordersInWork[item]);
                                                })
                                                console.log(ordersToRemove);


                                                const result = await OrderService.removeOrderFromWork(ordersToRemove.map(item => item.id));
                                                // await Promise.all(ordersToRemove.map(async (item) => {
                                                //     const removeOrderRes = await OrderService.removeOrderFromWork(item.id, item.status);
                                                //     console.log(removeOrderRes);
                                                // }));
                                                console.log('result from server', result);
                                                alert(`Следующие заказы удалены с работы!\n${ordersToRemove.map(item => item.name).join('\n')}`)
                                                // navigate('/start')
                                                refreshPage();

                                            } catch (error) {
                                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                                            }

                                        };


                                        const handleToChangeOrdersEmployee= async () => {
                                            try {
                                                const selectedOrdersIndices = Object.keys(rowSelection).map(item => parseInt(item));
                                                const ordersToChangeEmployee = [];
                                                selectedOrdersIndices.forEach(item => {
                                                    ordersToChangeEmployee.push(ordersInWork[item]);
                                                });

                                                console.log(ordersToChangeEmployee);

                                                const allUsers = await OrderService.getAllUsers();
                                                console.log(allUsers);
                                                // const serverRes = await OrderService.changeOrderResponsibleEmployee(ordersToChangeEmployee.map(item => item.id));
                                                // console.log(serverRes);
                                                // alert(`Смена ответственного у заказов:\n${ordersToChangeEmployee.map(item => item.name).join('\n')}`)

                                            } catch (error) {
                                                alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
                                            }

                                        };

                                        return (
                                            <div>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <Button
                                                        color="error"
                                                        // disabled={!table.getIsSomeRowsSelected()}
                                                        onClick={handleRemoveOrderFromWork}
                                                        variant="contained"
                                                    >
                                                        Удалить
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        // disabled={true}
                                                        onClick={handleToChangeOrdersEmployee}
                                                        variant="contained"
                                                    >
                                                        Сменить ответственного
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    }}
                />
                :
                <div>
                    <h3>Нет заказов в работе...</h3>
                </div>
            }
        </div>
    )
}
