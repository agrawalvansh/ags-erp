// src/router/modulesRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// page imports
import Invoice from './invoice/Invoice';
import Inventory from './inventory/Inventory';
import PriceList from './priceList/Price_List';
import Estimate from './estimate/Estimate';
import PaymentsRecived from './payments/PaymentsRecived';
import OrdersRecived from './orders/OrdersRecived';
import OrderDetail from './orders/OrderDetail';
import BuyerAccount from './accounts/BuyerAccount';
import BuyerAccountDetail from './accounts/BuyerAccountDetail';
import AddInventoryProduct from './inventory/AddInventoryProduct';

const ModulesRouter = () => (
  <div className="ml-0 md:ml-[280px] w-[100vw] md:w-[calc(100vw-280px)]">
    <Routes>
      <Route path="invoice" element={<Invoice />} />
      <Route path="invoice/:invoiceNo" element={<Invoice />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="inventory/add" element={<AddInventoryProduct />} />
      <Route path="price-list" element={<PriceList />} />
      <Route path="estimate" element={<Estimate />} />
      <Route path="payments/received" element={<PaymentsRecived />} />
      {/* Accounts / Buyers */}
      <Route path="accounts/buyers" element={<BuyerAccount />} />
      <Route path="accounts/buyers/:slug" element={<BuyerAccountDetail />} />
      {/* Orders */}
      <Route path="orders/received" element={<OrdersRecived />} />
      <Route path="orders/received/:orderNo" element={<OrderDetail />} />
    </Routes>
  </div>
);

export default ModulesRouter;