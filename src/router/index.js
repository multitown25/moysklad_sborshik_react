import RegistrationForm from "../components/RegistrationForm";
import Registration from "../pages/Registration";
import Start from "../pages/Start";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import OrderById from "../pages/OrderById";
import OrdersInWork from "../pages/OrdersInWork";
import DemandById from "../pages/DemandById";

export const privateRoutes = [
    // {path: '/registration', element: Registration}, // replace all elements to Pages,
    {path: '/orders/:id', element: OrderById},
    {path: '/demand/:id', element: DemandById},
    {path: '/orders', element: Orders},
    {path: '/start', element: Start},
    {path: '/ordersinwork', element: OrdersInWork},
    {path: '/login', element: Login}
]

export const publicRoutes = [
    {path: '/orders/:id', element: OrderById},
    {path: '/demand/:id', element: DemandById},
    {path: '/start', element: Start},
    {path: '/registration', element: Registration},
    {path: '/login', element: Login},
]