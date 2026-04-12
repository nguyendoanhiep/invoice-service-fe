import {toast} from "react-toastify";
import {getInvoiceHistory} from "../../order/redux";

import api from "../../../env/Config";

export const issueInvoiceByDate = (params) => async (dispatch) => {
    const res = await api.post(`/invoice/publish-invoice-by-date`, null, {
        params: params
    });
    if (res.data.data) {
        successNotification('Đã yêu cầu MISA tạo hoá đơn')
    } else {
        const message = res.data.message;
        failNotification(message)
    }

};

export const invoiceHistory = (params) => async (dispatch) => {
    const response = await api.get(`/order/invoice-history`, {
        params: params
    });
    await dispatch(getInvoiceHistory(response.data));

}

export const issueInvoiceByIds = (ids) => async (dispatch) => {
    const params = new URLSearchParams();
    ids.forEach(id => params.append("ids", id));

    const res = await api.post(`/invoice/publish-invoice-by-ids`,
        null,
        {params: params}
    );
    if (res.data.data) {
        successNotification('Đã yêu cầu MISA tạo hoá đơn')
    } else {
        const message = res.data.message;
        failNotification(message)
    }

};

export const publishViewInvoice = async (params) => {
    const res = await api.get(`/invoice/publishview`, {
        params: params
    });
    window.open(res.data.data, '_blank');

};

export const unpublishviewInvoice = async (params) => {
    const res = await api.get(`/invoice/unpublishview`, {
        params: params
    });
    window.open(res.data.data, '_blank');

};


export const downloadInvoiceByIds = async (transIds) => {
    const params = new URLSearchParams();
    transIds.forEach(id => params.append("transIds", id));
    try {
        const response = await api.post(
            "/invoice/download-invoice-by-ids", null,
            {
                params: params,
                responseType: "blob"
            }
        );

        const contentType = response.headers["content-type"];
        if (contentType && contentType.includes("application/json")) {
            // ❌ Backend trả lỗi
            const text = await response.data.text();
            const json = JSON.parse(text);

            failNotification(json.message || "Tải hoá đơn thất bại");
            return;
        }
        let fileName = "invoices.pdf";
        if (transIds.length !== 1) {
            fileName = "invoices.zip";
        }

        const blob = new Blob([response.data], {type: contentType});
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
        successNotification('Tải hoá đơn thành công')
    } catch (error) {
        console.error("Download invoice failed:", error);
        failNotification('Tải hoá đơn thất bại')
    }
}


export const downloadInvoiceByDate = async (params) => {
    try {
        const response = await api.post(
            "/invoice/download-invoice-by-date", null,
            {
                params: params,
                responseType: "blob"
            }
        );
        const contentType = response.headers["content-type"];
        if (contentType && contentType.includes("application/json")) {
            // ❌ Backend trả lỗi
            const text = await response.data.text();
            const json = JSON.parse(text);

            failNotification(json.message || "Tải hoá đơn thất bại");
            return;
        }

        const fileName = "invoices.zip";

        const blob = new Blob([response.data], {type: contentType});
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
        successNotification('Tải hoá đơn thành công')
    } catch (error) {
        console.error("Download invoice failed:", error.response.data);
        failNotification('Tải hoá đơn thất bại')
    }
}

export const successNotification = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000
    });
};

export const failNotification = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000
    });
};
