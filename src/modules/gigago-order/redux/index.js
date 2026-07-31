import {createSlice} from "@reduxjs/toolkit";

const gigagoOrderSlice = createSlice({
    name: 'gigagoOrder',
    initialState: { gigagoOrders: {}},
    reducers: {
        getAll: (state, action) => {
            state.gigagoOrders = action.payload.data;
        },
    },
});

export const {getAll} = gigagoOrderSlice.actions;

export default gigagoOrderSlice.reducer;