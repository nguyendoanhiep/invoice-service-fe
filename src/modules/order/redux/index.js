import {createSlice} from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: 'order',
    initialState: { orders: {}  , invoiceHistory : []},
    reducers: {
        getAll: (state, action) => {
            state.orders = action.payload.data;
        },
        getInvoiceHistory: (state, action) => {
            state.invoiceHistory = action.payload.data;
            console.log(action.payload.data)
        }
    },
});

export const {getAll,getInvoiceHistory} = orderSlice.actions;

export default orderSlice.reducer;