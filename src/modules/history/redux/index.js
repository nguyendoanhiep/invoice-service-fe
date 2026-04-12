import {createSlice} from "@reduxjs/toolkit";

const historySlice = createSlice({
    name: 'history',
    initialState: { histories: {}},
    reducers: {
        getAll: (state, action) => {
            state.histories = action.payload.data;
        },
    },
});

export const {getAll} = historySlice.actions;

export default historySlice.reducer;