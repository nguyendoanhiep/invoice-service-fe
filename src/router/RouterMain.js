import React from "react";
import {Routes, Route} from "react-router-dom";
import Invoice from "../modules/invoice/components/index";
import Order from "../modules/order/components/index";
import History from "../modules/history/component";
import Home from "../modules/home/components";
import InvoiceConfig from "../modules/invoice-config/components";
const RouterMain = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/invoice" element={<Invoice/>}/>
            <Route path="/order" element={<Order/>}/>
            <Route path="/invoice-config" element={<InvoiceConfig/>}/>
            <Route path="/history" element={<History/>}/>
        </Routes>
    )
};
export default RouterMain;