import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import UserData from '../data/UserData';
import InvoiceData from '../data/InvoiceData';
import OrderData from '../data/OrderData';
import TransactionData from '../data/TransactionData';

const BuyerAccountDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const buyer = UserData.find((u) => u.slug === slug) || {};

  const combinedData = useMemo(() => {
    const parseDateTime = (dateStr, timeStr = '00:00') => {
      // dateStr: dd/mm/yyyy , timeStr: hh:mm AM/PM
      const [day, month, year] = dateStr.split('/').map(Number);
      let hours = 0;
      let minutes = 0;
      if (timeStr) {
        const [time, meridian] = timeStr.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (meridian?.toLowerCase() === 'pm' && h !== 12) h += 12;
        if (meridian?.toLowerCase() === 'am' && h === 12) h = 0;
        hours = h;
        minutes = m;
      }
      return new Date(year, month - 1, day, hours, minutes).getTime();
    };

    const invoices = InvoiceData.filter((inv) => inv.slug === slug).map((inv) => ({
      type: 'invoice',
      id: inv.invoiceNo,
      date: inv.date,
      time: inv.time,
      amount: inv.totalAmount,
      timestamp: parseDateTime(inv.date, inv.time),
    }));

    const orders = OrderData.filter((o) => o.slug === slug).map((o) => ({
      type: 'order',
      id: o.orderNo,
      date: o.date,
      time: o.time,
      amount: o.totalAmount,
      timestamp: parseDateTime(o.date, o.time),
    }));

    const transactions = TransactionData.filter((t) => t.name === buyer.name).map((t) => ({
      type: 'txn',
      id: t.txnId,
      date: t.date,
      time: '',
      amount: t.amount,
      timestamp: parseDateTime(t.date),
    }));

    const all = [...invoices, ...orders, ...transactions];
    // Sort newest first
    all.sort((a, b) => b.timestamp - a.timestamp);
    return all;
  }, [slug, buyer]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(val);

  const handleRowClick = (row) => {
    if (row.type === 'order') navigate(`/orders/received/${row.id}`);
    else if (row.type === 'invoice') navigate(`/invoice/${row.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#caf0f8] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#05014A]">{buyer.name}</h1>
            {buyer.address && <p className="text-sm">{buyer.address}</p>}
            {buyer.phone && <p className="text-sm">Phone: {buyer.phone}</p>}
            {buyer.gstNumber && <p className="text-sm">GST: {buyer.gstNumber}</p>}
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#05014A] text-white">
                <tr>
                  <th className="p-3 text-left">No.</th>
                  <th className="p-3 text-left">Date & Time</th>
                  <th className="p-3 text-left">Invoice / Order / Txn ID</th>
                  <th className="p-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {combinedData.length > 0 ? (
                  combinedData.map((row, idx) => (
                    <tr
                      key={`${row.type}-${row.id}`}
                      className={`hover:bg-gray-50 transition-colors ${row.type !== 'txn' ? 'cursor-pointer' : ''}`}
                      onClick={() => handleRowClick(row)}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">
                        {row.date} {row.time}
                      </td>
                      <td className="p-3 font-medium text-gray-900">{row.id}</td>
                      <td className="p-3 font-semibold">{formatCurrency(row.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerAccountDetail;
