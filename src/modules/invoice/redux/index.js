import {createSlice} from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {invoices: {}},
    reducers: {
        getAll: (state, action) => {
            state.invoices = action.payload.data;
        },
    },
});

export const {getAll} = invoiceSlice.actions;

export default invoiceSlice.reducer;