import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import OrderService from "../services/OrderService";
import DemandService from "../services/DemandService";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;
    entityId = '';
    entitiesInWork = [];

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setEntitiesInWork(entities) {
        this.entitiesInWork = entities;
    }

    setUser(user) {
        this.user = user;
    }

    // setSborshik(bool) {
    //     this.isSborshik = bool;
    // }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setEntityId(entityId) {
        this.entityId = entityId;
    }

    async login(email, password, position) {
        try {
            const response = await AuthService.login(email, password, position);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            // this.setSborshik(this.sborshiks.includes(response.data.user.email))
            // console.log(this.isSborshik);
            console.log("УСПЕШНО")
            // console.log(this.sborshiks.includes(response.data.user.email))
        } catch (e) {
            console.log("ОШИБКА")
            console.log(e.response?.data?.message);
            alert(e.response?.data?.message);
        }
    }

    async registration(email, password, position) {
        try {
            const response = await AuthService.registration(email, password, position);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            // this.setSborshik(this.sborshiks.includes(response.data.user.email))
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

    async checkEntitiesInWork() {
        try {
            let entitiesInWork;
            if (this.user.position === 'Сборщик') {
                entitiesInWork = await OrderService.getOrdersInWorkByUser(false).then(data => JSON.parse(data.data));
            } else if (this.user.position === 'Упаковщик') {
                entitiesInWork = await DemandService.getDemandsInWorkByUser(false).then(data => JSON.parse(data.data));
            }
            // console.log(ordersInWork);
            this.setEntitiesInWork(entitiesInWork);

        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log({message: e.response?.data?.message, code: e.response?.status});
        } finally {
            this.setLoading(false);
        }
    }
}