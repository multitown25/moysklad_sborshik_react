import $api from "../http";

export default class OrderService {
    static async getAllOrders() {
        return $api.get(`/orders`)
    }

    static async getNewOrder(orderId) {
        return $api.post('/orders/getnew', orderId);
    }

    static async getOrderById(id) {
        return $api.get(`/orders/${id}`)
    }

    static async getOrderByOrderNumber(orderNumber) {
        return $api.get(`/demands/${orderNumber}`);
    }

    static async getAllUsers() {
        return $api.get(`/users`);
    }

    static async moveOrderToWaitingList(orderId, type, reason) {
        return $api.post('/orders/waitinglist', {orderId, type, reason})
    }

    static async changeOrderResponsibleEmployee(orderId, newEmployee) {
        return $api.patch('/ordersinwork/change/employee', orderId, newEmployee) //
    }

    static async changeOrderStatus(id, statusName, reason) {
        return $api.post(`/orders/changestatus/${id}`, {statusName, reason})
    }

    static async getAllOrdersInWork() {
        return $api.get(`/ordersinwork`);
    }

    static async getOrdersInWorkByUser(flagNeedNewOrder) {
        return $api.post(`/ordersinwork`, {flag: flagNeedNewOrder});
    }


    static async updateSelectedPositions(id, data) {
        return $api.patch(`/ordersinwork/${id}/update_selected_rows`, data)
    }

    static async removeOrderFromWork(id, type) {
        return $api.delete(`/orderinwork/${id}`, {type});
    }

    // static async addUserInfoToOrder(id, userEmail, userPosition) {
    //     return $api.post(`/orders/changebody/${id}`, {userEmail, userPosition});
    // }
}