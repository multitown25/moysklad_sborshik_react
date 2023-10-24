import React, { useEffect, useState, useMemo, useReducer, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import OrderService from '../services/OrderService';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Context } from '../index';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AccountCircle, Send } from '@mui/icons-material';

/**
 * выводить:
 * имя, дату, способ доставки, позиции
 * name, moment/created?, attributes.find(attribute => attribute.name == 'Способ доставки NEW').value, positions
 */

export default function OrderById() {
    const { store } = useContext(Context);
    const [order, setOrder] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    let [barcodeParts, setBarcodeParts] = useState('');
    const [barcode, setBarcode] = useState({});
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const params = useParams();
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
                    // <div>{cell.getValue()}</div>
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
        // getPositionsByOrderId(params.id);
    }, [])

    useEffect(() => {
        console.log(rowSelection)
    }, [rowSelection])

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Enter') {
                // console.log(barcodeParts)
                setBarcode({ value: barcodeParts });
                setBarcodeParts('');
                // console.log(barcodeParts)
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
            const needSelectRowIndex = order.products.findIndex(position => position.productBarcode === barcode.value);
            console.log(barcode.value)
            console.log(needSelectRowIndex);
            if (needSelectRowIndex === -1) {
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
                const response = await OrderService.getOrderById(id);
                console.log(response);
                const reformattedData = await reformatDataOrder(response.data);
                // console.log(reformattedData)
                setOrder(reformattedData);
                orderIsTaken = true;
                // const response = await axios.get('https://online.moysklad.ru/api/remap/1.2/entity/customerorder?filter=state.name=НА СБОРКЕ', config);
                // console.log(response);
            } catch (e) {
                console.log(e);
            }
        }

    }

    // async function getPositionsByOrderId(id) {
    //     try {
    //         const response = await OrderService.getPositionsByOrderId(id);
    //         console.log(response);
    //         const reformattedData = await reformatDataPositions(response.data.rows);
    //         setPositions(reformattedData);
    //         // const response = await axios.get('https://online.moysklad.ru/api/remap/1.2/entity/customerorder?filter=state.name=НА СБОРКЕ', config);
    //         // console.log(response);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    const reformatDataOrder = async (order) => {
        const name = order.name;
        const created = order.created;
        const deliveryWay = order.attributes?.find(attribute => attribute.name === 'Способ доставки NEW')?.value?.name;
        const comment = order.attributes?.find(attribute => attribute.name === 'Комментарий к заказу')?.value?.name;
        const positions = order.positions?.rows;
        const mappedPosition = positions.filter(position => position.assortment?.meta.type !== "service");
        const productsWithBundles = await Promise.all(
            mappedPosition.map(async (position) => {
                const quantity = position.quantity;
                // const resArr = [];

                if (position.assortment?.meta.type === "bundle") {
                    const bundleId = position.assortment?.meta.href.slice(-36);
                    const bundleComponentsResponse = await OrderService.getBundleComponents(bundleId);
                    const bundleComponents = bundleComponentsResponse.data.rows;
                    console.log(bundleComponents)
                    const res = await Promise.all(bundleComponents.map(async (component) => {
                        const componentHref = component.assortment.meta.href;
                        const url = componentHref.slice(0, componentHref.length - 12) + '?expand=images.meta.href,product.meta';
                        const [id, name, article, image, productBarcode] = await getProductFields(url);
                        return {
                            id,
                            name,
                            article,
                            image,
                            quantity,
                            productBarcode
                        }
                    }))
                    // resArr.push(res);
                    return res;
                } else {
                    const url = position.assortment?.meta.href + '?expand=images.meta.href,product.meta';
                    const [id, name, article, image, productBarcode] = await getProductFields(url);
                    // const product = await OrderService.fetchImages(url);
                    // console.log("PRODUCT")
                    // console.log(product)
                    // const name = product.data.name;
                    // const article = product.data.article ? product.data.article : product.data.product.article;
                    // // const image = await OrderService.getImage(product.data.images?.rows[0].meta.downloadHref);
                    // const image = product.data.images ? product.data.images.rows[0].miniature.downloadHref : "";
                    // const productBarcode = product.data.barcodes ? product.data.barcodes[0].ean13 : "";
                    // resArr.push({
                    //     name,
                    //     article,
                    //     image,
                    //     quantity,
                    //     productBarcode
                    // })
                    return {
                        id,
                        name,
                        article,
                        image,
                        quantity,
                        productBarcode
                    }
                }

            })
        );
        console.log(productsWithBundles)

        const products2 = [];
        productsWithBundles.forEach(item => {
            if (Array.isArray(item)) {
                item.forEach(item1 => products2.push(item1));
            } else {
                products2.push(item);
            }
        });

        const products = [];
        while (products2.length !== 0) {
            const item = products2.pop();
            console.log(item)
            if (!products.find(itemA => itemA.id === item.id)) {
                const obj = item;
                // console.log(obj);
                const foundItems = products2.filter(product => product.id === obj.id)
                // console.log(foundItems);
                foundItems.forEach(foundItem => {
                    // console.log(foundItem)
                    obj.quantity += foundItem.quantity;
                })
                // console.log(obj)
                products.push(obj);
            }
        }

        const result = {
            name,
            created,
            deliveryWay,
            comment,
            products
        }
        console.log(result);

        return result;
    }

    async function getProductFields(url) {
        const product = await OrderService.fetchImages(url);
        const name = product.data.name;
        const id = product.data.id;
        let article = product.data.article ? product.data.article : product.data.product.article;

        const characteristics = [];
        if (product.data.meta.type === "variant") {
            product.data.characteristics.forEach(characteristic => characteristics.push({ name: characteristic.name, value: characteristic.value }));
            let articlePart = '';
            characteristics.forEach(item => {
                articlePart += item.value
            })
            article = article + " " + articlePart;
        }

        // const image = await OrderService.getImage(product.data.images?.rows[0].meta.downloadHref);
        let image;
        if (product.data.images && product.data.images.rows.length !== 0) {
            image = product.data.images.rows[0].miniature.downloadHref;
        } else {
            image = "";
        }
        // const image = product.data.images ? product.data.images.rows[0].miniature.downloadHref : "";
        const productBarcode = product.data.barcodes ? product.data.barcodes[0].ean13 : "";

        return [id, name, article, image, productBarcode];
    }

    // ?? reserve
    // const reformatDataPositions = async (positionsRows) => {
    //     const result = await Promise.all(positionsRows.map(async position => {
    //         const product = await OrderService.fetchProduct(position.assortment.meta.href);
    //         const name = product.name
    //         const code = product.code
    //         const quantity = position;

    //         const imageURL = position.assortment.meta.href + '?expand=images.meta.href'

    //     }))

    // }

    return (
        <div>
            {order.products
                ?
                <MaterialReactTable columns={columns} data={order.products}
                    enableRowSelection
                    onRowSelectionChange={setRowSelection}
                    state={{ rowSelection }}
                    renderTopToolbarCustomActions={({ table }) => {
                        const handleCollectOrder = async () => {
                            try {
                                const result = await OrderService.changeOrderStatus(params.id, 'Собрано');
                                console.log(result);
                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.id);
                                console.log(removeOrderFromWork)
                                alert(`Заказ ${order.name} успешно собран!`)
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
                                const removeOrderFromWork = await OrderService.removeOrderFromWork(params.id, store.user.id);
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
                                        СОБРАТЬ
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
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Текущий заказ: ${order.name}`}</div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Способ доставки: ${order.deliveryWay}`}</div>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 9, marginLeft: 35 }}>{`Комментарий: ${order.comment}`}</div>
                            </div>

                        );
                    }}
                />
                :
                ""}
            {/* Loading component */}
        </div>
    )
}
