import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import invoiceReducer from '../modules/invoice/redux/index'
import orderReducer from '../modules/order/redux/index'
import historyReducer from '../modules/history/redux/index'
import gigagoOrderReducer from '../modules/gigago-order/redux/index'
import productSlice from '../modules/product/redux/index'
export default configureStore({
    reducer: {
        invoice : invoiceReducer,
        order : orderReducer,
        history : historyReducer,
        gigagoOrder : gigagoOrderReducer,
        product : productSlice,
    },
    middleware: [thunkMiddleware],

})
