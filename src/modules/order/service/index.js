import {getAll} from "../redux";
import {failNotification, successNotification} from "../../invoice/service";
import api from "../../../env/Config";

export const getOrders = (params) => async (dispatch) => {
    const response = await api.get(`/order`, {
        params: params
    });
    await dispatch(getAll(response.data));

};

export const handleTogglePublish = (record) => async (dispatch) => {
    const response =  await api.post("/order/update-source", {
        name: record.name,
        publishInvoice: !record.publishInvoice,
    });
    if (response.data.code === '200') {
        successNotification("Thành công")
    }
};

export const getSource = () => async (dispatch) => {
    const response = await api.get(`/order/source`);
    return response.data.data
};

export const syncOrders = (params) => async (dispatch) => {
    const response = await api.get(`/order/sync`, {
        params: params
    });
    if (response.data.data) {
        successNotification(response.data.data)
    } else {
        failNotification('Đồng bộ đơn hàng thất bại')
    }
    return response;

};

export const exportExcelFile = (params) => async (dispatch) => {
    const response = await api.get(`/order/excel`, {
        params: params,
        responseType: 'blob', // QUAN TRỌNG
        timeout: 300000 // 5 phút
    });
    if (response && response.data) {

        // Tạo blob từ response
        const blob = new Blob(
            [response.data],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        );

        // Lấy filename từ header nếu có
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        let fileName = `hugo_sim_${day}${month}${year}.xlsx`;
        const disposition = response.headers['content-disposition'];
        if (disposition) {
            const fileNameMatch = disposition.match(/filename="?(.+)"?/);
            if (fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }

        // Tạo link download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        successNotification('Export excel thành công')
    } else {
        failNotification('Export excel thất bại')
    }
    return response;

};

export const getReportDetails = (params) => async (dispatch) => {
    const response = await api.get(`/order/report-details`, {
        params: params
    });
    return response.data.data;

};

export const getReport = (params) => async (dispatch) => {
    const response = await api.get(`/order/report`, {
        params: params
    });
    return response.data.data;

};

export const markIsSuccessFunc = (params) => async (dispatch) => {
    const res = await api.post(`/order/mark-is-publish`, null,{params: params});
    if (res.data.data) {
        successNotification('Update thông tin đơn hàng thành công')
    } else {
        const message = res.data.message;
        failNotification(message)
    }
};

export const updateInFoBuyer = (data) => async (dispatch) => {
    const res = await api.post(`/order/update-info-buyer`, data);
    if (res.data.data) {
        successNotification('Update thông tin khách hàng thành công')
    } else {
        const message = res.data.message;
        failNotification(message)
    }
};
