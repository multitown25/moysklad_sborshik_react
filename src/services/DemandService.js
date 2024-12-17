import $api from "../http";

export default class DemandService {
    static async getAllDemands() {
        return $api.get(`/demand`)
    }

    static async getNewDemand(demandId) {
        return $api.post('/demand/getnew', demandId);
    }

    static async getDemandById(id) {
        return $api.get(`/demand/${id}`)
    }

    static async getAllUsers() {
        return $api.get(`/users`);
    }

    static async moveDemandToWaitingList(demandId, type, reason) {
        return $api.post('/demand/waitinglist', {demandId, type, reason})
    }

    static async changeDemandResponsibleEmployee(demandId, newEmployee) {
        return $api.patch('/ordersinwork/change/employee', demandId, newEmployee) //
    }

    static async changeStatus(id, statusName, reason) {
        return $api.post(`/demand/changestatus/${id}`, {statusName, reason})
    }

    static async getAllDemandsInWork() {
        return $api.get(`/ordersinwork`);
    }

    static async getDemandsInWorkByUser(flagNeedNewOrder) {
        return $api.post(`/demand/inwork`, {flag: flagNeedNewOrder});
    }

    static async updateSelectedPositions(id, data) {
        return $api.patch(`/demand/inwork/${id}/update_selected_rows`, data)
    }

    static async removeDemandFromWork(id, type) {
        return $api.delete(`/demand/inwork/${id}`, {type});
    }

    // static async addUserInfoToOrder(id, userEmail, userPosition) {
    //     return $api.post(`/orders/changebody/${id}`, {userEmail, userPosition});
    // }
}