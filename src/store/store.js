import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {API_URL} from "../http";

export default class Store {
    sborshiks = ["Татьяна", "Наталья", "Светлана", "Олег"];
    user = {};
    isAuth = false;
    isLoading = false;
    orderId = '';
    isSborshik = true;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setSborshik(bool) {
        this.isSborshik = bool;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setOrderId(orderId) {
        this.orderId = orderId;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setSborshik(this.sborshiks.includes(response.data.user.email))
            console.log(this.isSborshik);
            console.log("УСПЕШНО")
            console.log(this.sborshiks.includes(response.data.user.email))
            // router.push(`/posts/${props.post.id}
        } catch (e) {
            console.log("ОШИБКА")
            console.log(e.response?.data?.message);
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setSborshik(this.sborshiks.includes(response.data.user.email))
            alert("УСПЕШНО!")
        } catch (e) {
            console.log(e.response?.data?.message);
            alert(e.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}