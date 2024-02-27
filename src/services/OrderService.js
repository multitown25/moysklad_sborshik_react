import $api from "../http";

export default class OrderService {
    static async getAllOrders(status) {
        return $api.post(`/orders`, {status})
    }

    static async getOrderById(id) {
        return $api.get(`/orders/${id}`)
    }

    static async changeOrderStatus(id, statusName) {
        return $api.post(`/orders/${id}`, {statusName})
    }

    static async getAllOrdersInWork(type) {
        return $api.get(`/ordersinwork${type}`);
    }

    static async getOrderInWorkByUser(userEmail) {
        return $api.get(`/ordersinwork/${userEmail}`)
    }

    static async setOrderInWork(id, userEmail, orderName) {
        return $api.post(`/orderinwork/${id}`, {userEmail, orderName});
    }

    static async removeOrderFromWork(id, userEmail) {
        return $api.delete(`/orderinwork/${id}`, {userEmail});
    }

    static async addSborshikToOrder(id, userEmail) {
        return $api.post(`/orders/${id}/changebody`, {userEmail});
    }
}