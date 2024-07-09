import React, {useEffect, useState, useContext, useMemo} from 'react'
import OrderService from '../services/OrderService'
import { Context } from '../index'
import MyButton from '../UI/MyButton/MyButton';
import {MaterialReactTable} from "material-react-table";
import OrderList from "../components/OrderList";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import Popup from "reactjs-popup";
import Select from 'react-select';
import OrderItem from "../components/OrderItem";

export default function OrdersInWork() {
    const [ordersInWork, setOrdersInWork] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isNewUserButtonClicked, setIsNewUserButtonClicked] = useState(false);
    // const [newUser, setNewUser] = useState(null);
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

    async function changeEmployeeForOrder(newEmployee) {
        try {
            setTimeout(() => setIsNewUserButtonClicked(false), 500);

            const selectedOrdersIndices = Object.keys(rowSelection).map(item => parseInt(item));
            const orderToChange = ordersInWork[selectedOrdersIndices];
            // const ordersToChangeEmployee = [];
            // selectedOrdersIndices.forEach(item => {
            //     ordersToChangeEmployee.push(ordersInWork[item]);
            // });
            // console.log(ordersToChangeEmployee);
            console.log(orderToChange);
            console.log(newEmployee);
            // console.log(`${ordersToChangeEmployee[0]}`)

            const changeEmployeeRes = await OrderService.changeOrderResponsibleEmployee({orderId: orderToChange.id, newEmployee});
            console.log(changeEmployeeRes);
            setOrdersInWork(changeEmployeeRes.data);
            // alert(`Смена ответственного у заказа: ${orderToChange.name} с ${orderToChange.employee} на ${newEmployee.email} -`)

        } catch (error) {
            alert(`Ошибка! Что-то пошло не так...\n${error.message}`)
        }
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
                                                // setNewUser(ordersToChangeEmployee[0].employee);
                                                const allUsers = await OrderService.getAllUsers();
                                                setAllUsers(allUsers.data);
                                                console.log(allUsers);
                                                setIsNewUserButtonClicked(true);

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

            <Popup open={isNewUserButtonClicked} onClose={() => setIsNewUserButtonClicked(false)}>
                <h2> Кого назначить ответственным? </h2>
                <Select
                    // defaultValue={newUser}
                    placeholder={'Новый ответственный..'}
                    onChange={(user) => changeEmployeeForOrder(user)}
                    options={allUsers}
                    getOptionLabel={(user) => `${user.email}: ${user.position}`}
                    getOptionValue={(user) => `${user.email}`}
                />
                {/*<MyButton onClick={() => }> Отправить </MyButton>*/}
            </Popup>
        </div>
    )
}
