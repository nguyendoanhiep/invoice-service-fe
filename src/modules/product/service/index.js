import api from "../../../env/Config";
import {failNotification} from "../../invoice/service";
import {getAll} from "../redux";


export const getProducts = (params) => async (dispatch) => {
    try {
        const response = await api.get(`/product`,{
            params: params
        });
        await dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
        failNotification("Thất bại , vui lòng liên hệ admin")
    }
};