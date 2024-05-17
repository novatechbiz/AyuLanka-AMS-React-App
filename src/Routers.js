import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Login from "./components/login";
import Main from "./components/main";
import Admin from "./components/admin";
import PurchaseRequisition from "./components/purchaseRequisition/purchaseRequisition";
import PurchaseOrder from "./components/purchaseOrder/purchaseOrder";
import Grn from "./components/grn/grn";
import SalesOrder from "./components/salesOrder/salesOrder";
import SalesInvoice from "./components/salesInvoice/salesInvoice";
import SalesReceipt from "./components/salesReceipt/salesReceipt";
import PurchaseRequisitionList from "./components/purchaseRequisition/PurchaseRequisitionList/PurchaseRequisitionList";
import ItemMaster from "./components/itemMaster/itemMaster";
import Category from "./components/category/category";
import Unit from "./components/unit/unit";
import Supplier from "./components/supplier/supplierMain/supplier";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default Routers;
