import React from "react";
import {Routes, Route} from "react-router-dom";
import GigagoOrder from "../modules/gigago-order/component/index";
import Order from "../modules/order/components/index";
import History from "../modules/history/component";
import Home from "../modules/home/components";
import InvoiceConfig from "../modules/invoice-config/components";
import Product from "../modules/product/component";
const RouterMain = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/gigago-order" element={<GigagoOrder/>}/>
            <Route path="/product" element={<Product/>}/>
            <Route path="/order" element={<Order/>}/>
            <Route path="/invoice-config" element={<InvoiceConfig/>}/>
            <Route path="/history" element={<History/>}/>
        </Routes>
    )
};
export default RouterMain;