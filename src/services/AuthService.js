import $api from "../http";

export default class AuthService {
    static async login(email, password, position) {
        return $api.post('/login', {email, password, position})
    }

    static async registration(email, password, position) {
        return $api.post('/registration', {email, password, position})
    }

    static async logout() {
        return $api.post('/logout')
    }
}