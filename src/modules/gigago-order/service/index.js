import api from "../../../env/Config";
import {failNotification} from "../../invoice/service";
import {getAll} from "../redux";


export const getGigagoOrders = (params) => async (dispatch) => {
    try {
        const response = await api.get(`/gigago-order`,{
            params: params
        });
        await dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
};

export const submitGigagoOrders = async (params) => {
    return api.post('/gigago-order', null, {
        params
    });
};