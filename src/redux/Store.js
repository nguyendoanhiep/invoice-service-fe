import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import invoiceReducer from '../modules/invoice/redux/index'
import orderReducer from '../modules/order/redux/index'
import historyReducer from '../modules/history/redux/index'
export default configureStore({
    reducer: {
        product : invoiceReducer,
        order : orderReducer,
        history : historyReducer,
    },
    middleware: [thunkMiddleware],

})
