import {getAll} from "../redux";
import {failNotification} from "../../invoice/service";
import api from "../../../env/Config";

export const getHistories = (params) => async (dispatch) => {
    try {
        const response = await api.get(`/history`,{
            params: params
        });
        await dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
};