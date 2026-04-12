import {createSlice} from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {invoice: {}},
    reducers: {
        getAll: (state, action) => {
            state.products = action.payload.data;
        },
    },
});

export const {getAll} = invoiceSlice.actions;

export default invoiceSlice.reducer;