import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Calendar, Edit, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

import UserData from '../data/UserData';
import InvoiceData from '../data/InvoiceData';
import OrderData from '../data/OrderData';
import TransactionData from '../data/TransactionData';

const BuyerAccountDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const buyer = UserData.find((u) => u.slug === slug) || {};

  // Combine Maal (debit) and Jama (credit) data
  const accountData = useMemo(() => {
    // Mock data creation for demonstration
    const maalEntries = [
      ...InvoiceData.filter((inv) => inv.slug === slug).map((inv) => ({
        type: 'maal',
        id: `M-${inv.invoiceNo}`,
        maalDate: inv.date,
        maalInvoiceNumber: inv.invoiceNo,
        maalAmount: inv.totalAmount,
        maalRemark: `Invoice for ${inv.productDetails.length} items`,
        jamaDate: '',
        jamaTxnType: '',
        jamaAmount: 0,
        jamaRemark: '',
      })),
      ...OrderData.filter((o) => o.slug === slug).map((o) => ({
        type: 'maal',
        id: `M-${o.orderNo}`,
        maalDate: o.date,
        maalInvoiceNumber: o.orderNo,
        maalAmount: o.totalAmount,
        maalRemark: `Order ${o.orderNo}`,
        jamaDate: '',
        jamaTxnType: '',
        jamaAmount: 0,
        jamaRemark: '',
      }))
    ];

    const jamaEntries = TransactionData.filter((t) => t.name === buyer.name).map((t) => ({
      type: 'jama',
      id: `J-${t.txnId}`,
      maalDate: '',
      maalInvoiceNumber: '',
      maalAmount: 0,
      maalRemark: '',
      jamaDate: t.date,
      jamaTxnType: t.paymentMethod || 'Cash',
      jamaAmount: t.amount,
      jamaRemark: t.description || 'Payment received',
    }));

    // Combined data with date parsing for sorting and filtering
    const combined = [...maalEntries, ...jamaEntries].map(entry => {
      const date = entry.type === 'maal' 
        ? parseDate(entry.maalDate) 
        : parseDate(entry.jamaDate);
      
      return {
        ...entry,
        sortDate: date
      };
    });

    // Sort by date, newest first
    combined.sort((a, b) => b.sortDate - a.sortDate);
    
    return combined;
  }, [slug, buyer]);

  // Parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filter data based on date range and search query
  const filteredData = useMemo(() => {
    let filtered = [...accountData];

    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      filtered = filtered.filter(item => 
        item.sortDate >= fromDateObj
      );
    }

    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59);
      filtered = filtered.filter(item => 
        item.sortDate <= toDateObj
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.maalInvoiceNumber && item.maalInvoiceNumber.toLowerCase().includes(query)) ||
        (item.maalRemark && item.maalRemark.toLowerCase().includes(query)) ||
        (item.jamaTxnType && item.jamaTxnType.toLowerCase().includes(query)) ||
        (item.jamaRemark && item.jamaRemark.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [accountData, fromDate, toDate, searchQuery]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Format currency
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(val || 0);

  // Handle row edit
  const handleEditClick = (index) => {
    setEditingRow(index);
  };

  // Save edited row
  const handleSaveEdit = (index) => {
    // In a real app, you would save changes to your backend here
    setEditingRow(null);
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate, searchQuery, rowsPerPage]);

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

      {/* Filters */}
      <div className="px-4 md:px-6 py-3 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
            <button 
              className="flex items-center text-[#05014A] font-medium hover:bg-gray-100 rounded-lg px-3 py-2 transition"
              onClick={() => setIsFiltering(!isFiltering)}
            >
              <Filter size={18} className="mr-2" />
              {isFiltering ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="pl-9 pr-3 py-2 border rounded-lg w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className="border rounded-lg px-3 py-2 bg-white"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </div>
          
          {isFiltering && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="pl-9 pr-3 py-2 border rounded-lg w-full"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="pl-9 pr-3 py-2 border rounded-lg w-full"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  onClick={() => {
                    setFromDate('');
                    setToDate('');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#05014A] text-white">
                  <th rowSpan="2" className="px-3 py-2 text-left border border-gray-300">Sr No.</th>
                  <th colSpan="4" className="px-3 py-2 text-center border border-gray-300">Maal</th>
                  <th colSpan="4" className="px-3 py-2 text-center border border-gray-300">Jama</th>
                  <th rowSpan="2" className="px-3 py-2 text-center border border-gray-300">Actions</th>
                </tr>
                <tr className="bg-[#05014A] text-white">
                  {/* Maal subcolumns */}
                  <th className="px-3 py-2 text-left border border-gray-300">Date</th>
                  <th className="px-3 py-2 text-left border border-gray-300">Invoice Number</th>
                  <th className="px-3 py-2 text-right border border-gray-300">Amount</th>
                  <th className="px-3 py-2 text-left border border-gray-300">Remark</th>
                  
                  {/* Jama subcolumns */}
                  <th className="px-3 py-2 text-left border border-gray-300">Date</th>
                  <th className="px-3 py-2 text-left border border-gray-300">Tranx Type</th>
                  <th className="px-3 py-2 text-right border border-gray-300">Amount</th>
                  <th className="px-3 py-2 text-left border border-gray-300">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        editingRow === idx ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-3 py-2 border border-gray-300">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      
                      {/* Maal columns */}
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.maalDate}
                          />
                        ) : (
                          row.maalDate
                        )}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.maalInvoiceNumber}
                          />
                        ) : (
                          row.maalInvoiceNumber
                        )}
                      </td>
                      <td className="px-3 py-2 text-right border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="number" 
                            className="w-full p-1 border rounded text-right"
                            defaultValue={row.maalAmount}
                          />
                        ) : (
                          formatCurrency(row.maalAmount)
                        )}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.maalRemark}
                          />
                        ) : (
                          row.maalRemark
                        )}
                      </td>
                      
                      {/* Jama columns */}
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.jamaDate}
                          />
                        ) : (
                          row.jamaDate
                        )}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.jamaTxnType}
                          />
                        ) : (
                          row.jamaTxnType
                        )}
                      </td>
                      <td className="px-3 py-2 text-right border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="number" 
                            className="w-full p-1 border rounded text-right"
                            defaultValue={row.jamaAmount}
                          />
                        ) : (
                          formatCurrency(row.jamaAmount)
                        )}
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        {editingRow === idx ? (
                          <input 
                            type="text" 
                            className="w-full p-1 border rounded"
                            defaultValue={row.jamaRemark}
                          />
                        ) : (
                          row.jamaRemark
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-3 py-2 text-center border border-gray-300">
                        {editingRow === idx ? (
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                              onClick={() => handleSaveEdit(idx)}
                            >
                              Save
                            </button>
                            <button 
                              className="px-3 py-1 bg-gray-300 rounded-md text-sm hover:bg-gray-400 transition"
                              onClick={() => setEditingRow(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition"
                            onClick={() => handleEditClick(idx)}
                          >
                            <Edit size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-3 py-6 text-center text-gray-500 border border-gray-300">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#05014A] hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className={`p-2 rounded-md ${
                    currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#05014A] hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyerAccountDetail;