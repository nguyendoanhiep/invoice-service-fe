import api from "../../../env/Config";
import {failNotification, successNotification} from "../../invoice/service";
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

export const getEndpoint = async () => {
    try {
        const response = await api.get(`/gigago-order/end-points`);
        return response.data;

    } catch (error) {
        console.log(error);
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
};

export const refreshData = async (params) => {
    try {
        const response = await api.get(`/gigago-order/get-data-from-server`,{
            params: params
        });
        successNotification("Refresh thành công")
        return response.data;

    } catch (error) {
        console.log(error);
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
};


export const submitGigagoOrders = async (params) => {
    return await api.post('/gigago-order', null, {
        params
    });
};

export const saveGigagoOrders = async (body) => {
    return await api.put('/gigago-order', body);
};

export const deleteGigagoOrders = async (requestId) => {
    const response =await api.delete('/gigago-order/'+requestId);
    if (response.data.code === '200') {
        successNotification("Thành công")
    }else {
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
    return response;
};