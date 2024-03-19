import $api from "../http";

export default class OrderService {
    static async getAllOrders() {
        return $api.get(`/orders`)
    }

    static async getNewOrder() {
        return $api.post('/orders/getnew');
    }

    static async getOrderById(id) {
        return $api.get(`/orders/${id}`)
    }

    static async getAllUsers() {
        return $api.get(`/users`);
    }

    static async moveOrderToWaitingList(orderId) {
        return $api.post('/orders/waitinglist', {orderId})
    }

    static async changeOrderResponsibleEmployee(ordersId) {
        return $api.patch('/ordersinwork/change/employee', {ordersId})
    }

    static async changeOrderStatus(id, statusName, description) {
        return $api.post(`/orders/changestatus/${id}`, {statusName, description})
    }

    static async getAllOrdersInWork() {
        return $api.get(`/ordersinwork`);
    }

    static async getOrdersInWorkByUser(flagNeedNewOrder) {
        return $api.post(`/ordersinwork`, {flag: flagNeedNewOrder});
    }

    static async setOrderInWork(id) {
        return $api.post(`/orderinwork/${id}`);
    }

    static async updateSelectedPositions(id, data) {
        return $api.patch(`/ordersinwork/${id}/update_selected_rows`, data)
    }

    static async removeOrderFromWork(id, type) {
        return $api.delete(`/orderinwork/${id}`, {type});
    }

    static async addSborshikToOrder(id, userEmail) {
        return $api.post(`/orders/changebody/${id}`, {userEmail});
    }
}