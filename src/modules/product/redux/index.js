import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: { products: {}},
    reducers: {
        getAll: (state, action) => {
            state.products = action.payload.data;
        },
    },
});

export const {getAll} = productSlice.actions;

export default productSlice.reducer;