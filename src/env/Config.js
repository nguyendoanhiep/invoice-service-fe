import axios from "axios";
import {failNotification} from "../modules/invoice/service";


const domain = "/api";

const api = axios.create({
    baseURL: domain,
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers["Token"] = JSON.parse(token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400) {
            failNotification(message);
        }
        if (status === 500) {
            failNotification("Lỗi hệ thống, vui lòng thử lại sau");
        }
        return Promise.reject(error);
    }
);

export default api;
