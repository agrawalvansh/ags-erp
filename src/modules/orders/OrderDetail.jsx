import React from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

import OrderData from '../data/OrderData';
import UserData from '../data/UserData';

const OrderDetail = () => {
  const { orderNo } = useParams();
  const order = OrderData.find((o) => o.orderNo === orderNo);

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }

  const customer = UserData.find((u) => u.slug === order.slug) || {};

  const formatNumber = (value) => (parseFloat(value) || 0).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-2 sm:p-6 min-h-screen bg-gray-50">
      <div className="max-w-[1040px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-3 sm:p-6 border-b flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#05014A]">{customer.name}</h2>
            {customer.address && <p className="text-sm">{customer.address}</p>}
            {customer.phone && <p className="text-sm">Phone: {customer.phone}</p>}
            {customer.gstNumber && <p className="text-sm">GST: {customer.gstNumber}</p>}
          </div>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Order No:</span> {order.orderNo}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {order.date}
            </p>
            {order.time && (
              <p>
                <span className="font-semibold">Time:</span> {order.time}
              </p>
            )}
            <p>
              <span className="font-semibold">Payment:</span> {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-3 sm:p-6 overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-[#05014A] text-white">
              <tr>
                <th className="p-2 sm:p-3">No.</th>
                <th className="p-2 sm:p-3 text-left">Product</th>
                <th className="p-2 sm:p-3">Qty</th>
                <th className="p-2 sm:p-3 text-right">Price</th>
                <th className="p-2 sm:p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.productDetails.map((item, idx) => {
                const amount = item.quantity * item.sellingPrice;
                return (
                  <tr key={idx}>
                    <td className="p-2 sm:p-3 text-center">{idx + 1}</td>
                    <td className="p-2 sm:p-3">{item.productName}</td>
                    <td className="p-2 sm:p-3 text-center">{item.quantity}</td>
                    <td className="p-2 sm:p-3 text-right">{formatNumber(item.sellingPrice)}</td>
                    <td className="p-2 sm:p-3 text-right">{formatNumber(amount)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan="4" className="p-2 sm:p-3 text-right font-bold">
                  Total
                </td>
                <td className="p-2 sm:p-3 text-right font-bold">
                  {formatNumber(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-6 border-t flex justify-center sm:justify-end">
          <button
            onClick={handlePrint}
            className="bg-[#05014A] text-white px-4 py-2 rounded hover:bg-[#0A0A47] transition-colors flex items-center"
          >
            <Printer size={16} className="mr-2" /> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
