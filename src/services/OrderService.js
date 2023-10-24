import $api from "../http";

export default class OrderService {
    static async getAllOrders() {
        return $api.get('/orders')
    }

    static async getOrderById(id) {
        return $api.get(`/orders/${id}`)
    }

    static async changeOrderStatus(id, statusName) {
        return $api.post(`/orders/${id}`, {statusName})
    }

    static async getPositionsByOrderId(id) {
        return $api.get(`/orders/${id}/positions`)
    }

    static async fetchImages(imageURL) {
        return $api.post(`/images`, {imgURL: imageURL})
    }

    static async getImage(imageURL) {
        return $api.post('/img', {imgURL: imageURL})
    }

    static async getBundleComponents(id) {
        return $api.get(`/bundle/${id}/components`)
    }

    static async getAllOrdersInWork() {
        return $api.get(`/ordersinwork`);
    }

    static async getOrderInWorkByUser(userId) {
        return $api.get(`/ordersinwork/${userId}`)
    }

    static async setOrderInWork(id, userId) {
        return $api.post(`/orderinwork/${id}`, {userId});
    }

    static async removeOrderFromWork(id, userId) {
        return $api.delete(`/orderinwork/${id}`, {userId});
    }
}