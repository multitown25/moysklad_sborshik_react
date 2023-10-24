import RegistrationForm from "../components/RegistrationForm";
import Registration from "../pages/Registration";
import Start from "../pages/Start";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import OrderById from "../pages/OrderById";

export const privateRoutes = [
    {path: '/registration', element: Registration}, // replace all elements to Pages
    {path: '/orders', element: Orders},
    {path: '/orders/:id', element: OrderById},
    {path: '/start', element: Start}
]

export const publicRoutes = [
    {path: '/login', element: Login},
]