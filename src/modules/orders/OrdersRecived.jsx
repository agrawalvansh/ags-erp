import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import OrderData from '../data/OrderData';
import UserData from '../data/UserData';

const OrdersRecived = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Map slug -> user for quick lookup
  const userMap = useMemo(
    () => UserData.reduce((acc, u) => {
      acc[u.slug] = u;
      return acc;
    }, {}),
    []
  );

  const processedOrders = useMemo(() => {
    // Merge name
    let merged = OrderData.map((o) => ({
      ...o,
      name: userMap[o.slug]?.name || o.slug,
    }));

    // Search filter
    let filtered = merged.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination slice
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [searchTerm, sortConfig, currentPage]);

  const totalPages = Math.ceil(
    OrderData.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userMap[o.slug]?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage
  );

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val);

  const handleRowClick = (orderNo) => {
    navigate(`/orders/received/${orderNo}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#caf0f8] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#05014A]">Orders Received</h1>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search order or customer..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#05014A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </header>

      {/* Orders Table */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#05014A] text-white">
                <tr>
                  <th className="p-3 text-left">No.</th>
                  <th
                    className="p-3 text-left cursor-pointer hover:bg-[#03012e] transition-colors"
                    onClick={() => handleSort('orderNo')}
                  >
                    <div className="flex items-center">
                      Order No
                      <ChevronDown
                        className={`ml-1 transition-transform ${
                          sortConfig.key === 'orderNo' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                        }`}
                        size={16}
                      />
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer hover:bg-[#03012e] transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ChevronDown
                        className={`ml-1 transition-transform ${
                          sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                        }`}
                        size={16}
                      />
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer hover:bg-[#03012e] transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <ChevronDown
                        className={`ml-1 transition-transform ${
                          sortConfig.key === 'date' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                        }`}
                        size={16}
                      />
                    </div>
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer hover:bg-[#03012e] transition-colors"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <ChevronDown
                        className={`ml-1 transition-transform ${
                          sortConfig.key === 'totalAmount' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                        }`}
                        size={16}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedOrders.length > 0 ? (
                  processedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(order.orderNo)}
                    >
                      <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-3 font-medium text-gray-900">{order.orderNo}</td>
                      <td className="p-3">{order.name}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    processedOrders.length + (currentPage - 1) * itemsPerPage
                  )}
                </span>{' '}
                of <span className="font-medium">{OrderData.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-[#05014A] text-white hover:bg-[#03012e] cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-[#05014A] text-white hover:bg-[#03012e] cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersRecived;