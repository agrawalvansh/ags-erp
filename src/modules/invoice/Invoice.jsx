import { useState, useEffect, useRef } from 'react';
import { Printer, Plus, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import Data from '../data/Data';
import InvoiceData from '../data/InvoiceData';

const Invoice = () => {
  const { invoiceNo } = useParams();
  const printRef = useRef(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [newItem, setNewItem] = useState({
    id: '',
    productName: '',
    quantity: '',
    packingType: '',
    sellingPrice: '',
  });
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [packing, setPacking] = useState('');
  const [freight, setFreight] = useState('');
  const [riksha, setRiksha] = useState('');
  const [buyer, setBuyer] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [remark, setRemark] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [customInvoiceNo] = useState('EST-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
  const [formErrors, setFormErrors] = useState({});
  
  // Calculate grand total with roundoff
  const calculateGrandTotal = () => {
    const subtotal = total + parseFloat(packing || 0) + parseFloat(freight || 0) + parseFloat(riksha || 0);
    const roundedTotal = Math.round(subtotal);
    const roundOff = roundedTotal - subtotal;
    
    return {
      subtotal,
      roundOff,
      grandTotal: roundedTotal
    };
  };

  // Load invoice items
  useEffect(() => {
    let processedData = [];

    if (invoiceNo) {
      const inv = InvoiceData.find((i) => i.invoiceNo === invoiceNo);
      if (inv) {
        processedData = inv.productDetails.map((item) => {
          return {
            ...item,
            amount: (item.quantity * item.sellingPrice).toFixed(2)
          };
        });
        // Populate customer data
        setBuyer(inv.buyer || '');
        setMobileNo(inv.mobileNo || '');
        setAddress(inv.address || '');
        setRemark(inv.remark || '');
        setInvoiceDate(inv.invoiceDate || new Date().toISOString().split('T')[0]);
      }
    } else {
      processedData = Data.map((item) => {
        return {
          ...item,
          quantity: item.quantity,
          amount: (item.quantity * item.sellingPrice).toFixed(2)
        };
      });
    }

    setInvoiceItems(processedData);
  }, [invoiceNo]);

  useEffect(() => {
    calculateTotal();
  }, [invoiceItems]);

  const calculateTotal = () => {
    const sum = invoiceItems.reduce((acc, item) => {
      return acc + (parseFloat(item.amount) || 0);
    }, 0);
    setTotal(sum);
  };

  const handleProductSelect = (e) => {
    const productName = e.target.value;
    setSelectedProduct(productName);
    
    if (productName) {
      const product = Data.find(item => item.productName === productName);
      if (product) {
        setNewItem({
          ...newItem,
          id: product.id,
          productName: product.productName,
          sellingPrice: product.sellingPrice.toString(),
          packingType: product.packingType,
          quantity: ''
        });
      }
    } else {
      setNewItem({
        id: '',
        productName: '',
        quantity: '',
        packingType: 'pc',
        sellingPrice: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newItem.productName) errors.productName = 'Product is required';
    if (!newItem.quantity) errors.quantity = 'Quantity is required';
    if (!newItem.sellingPrice) errors.sellingPrice = 'Price is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;
  
    const quantity = parseFloat(newItem.quantity);
    const sellingPrice = parseFloat(newItem.sellingPrice);
    
    if (isNaN(quantity) || isNaN(sellingPrice) || quantity <= 0 || sellingPrice <= 0) {
      alert('Please enter valid quantity and selling price');
      return;
    }
    
    const amount = quantity * sellingPrice;
  
    const newInvoiceItem = {
      id: newItem.id || Date.now(),
      productName: newItem.productName,
      quantity: quantity.toFixed(3),
      packingType: newItem.packingType,
      sellingPrice: sellingPrice.toFixed(2),
      amount: amount.toFixed(2)
    };
  
    setInvoiceItems([...invoiceItems, newInvoiceItem]);
    setNewItem({
      id: '',
      productName: '',
      quantity: '',
      packingType: 'pc',
      sellingPrice: ''
    });
    setSelectedProduct('');
    setFormErrors({});
  };

  const handleDeleteItem = (indexToDelete) => {
    const newItems = [...invoiceItems];
    newItems.splice(indexToDelete, 1);
    setInvoiceItems(newItems);
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const formatNumber = (value) => {
    return (parseFloat(value) || 0).toFixed(2);
  };

  const { roundOff, grandTotal } = calculateGrandTotal();

  return (
    <div className="p-2 sm:p-6 min-h-screen bg-gray-50 print:bg-transparent print:text-black">
      <div 
        ref={printRef}
        className="max-w-[1040px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none"
      >
        {/* Header Section */}
        <div className="p-3 sm:p-6 border-b print:p-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#05014A]">ESTIMATE</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <p className="font-semibold">
                <span className="text-gray-600">Invoice No.: </span>
                {customInvoiceNo}
              </p>
            </div>
            <div>
              <p className="font-semibold">
                <span className="text-gray-600">Invoice Date: </span>
                <input 
                  type="date" 
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="border rounded px-2 py-1 print:border-none print:bg-transparent appearance-none"
                />
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="inline-block w-28 text-sm font-medium text-gray-700 mr-2">Buyer:</label>
                <input
                  type="text"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition print:border-none"
                  placeholder="Buyer Name"
                />
              </div>
              <div className="flex items-center">
                <label className="inline-block w-28 text-sm font-medium text-gray-700 mr-2">Mobile No:</label>
                <input
                  type="text"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition print:border-none"
                  placeholder="Mobile Number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="inline-block w-28 text-sm font-medium text-gray-700 mr-2">Address:</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition print:border-none resize-none"
                  placeholder="Address"
                  rows="2"
                ></textarea>
              </div>
              <div className="flex items-center">
                <label className="inline-block w-28 text-sm font-medium text-gray-700 mr-2">Remark:</label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition print:border-none"
                  placeholder="Remark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View for Small Screens */}
        <div className="block sm:hidden p-3 print:hidden">
          {invoiceItems.map((item, index) => (
            <div 
              key={`mobile-${item.id}-${index}`} 
              className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span>Qty: </span>
                  <span className="font-medium">{item.quantity} {item.packingType}</span>
                </div>
                <div>
                  <span>Rate: </span>
                  <span className="font-medium">₹{formatNumber(item.sellingPrice)}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-100">
                  <span>Amount: </span>
                  <span className="font-semibold text-gray-800">₹{formatNumber(item.amount)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Add Item Form */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100 print:hidden">
            <h4 className="font-semibold mb-3 text-[#05014A] flex items-center">
              <Plus size={18} className="mr-2" />
              Add New Item
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={selectedProduct}
                  onChange={handleProductSelect}
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Product</option>
                  {Data.map((product) => (
                  <option key={product.id} value={product.productName}>
                    {product.productName} - ₹{product.sellingPrice}
                  </option>
                ))}
                </select>
                {formErrors.productName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.productName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Qty"
                  />
                  {formErrors.quantity && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newItem.packingType}
                    onChange={(e) => setNewItem({...newItem, packingType: e.target.value})}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="PCS">PCS</option>
                    <option value="KGS">KGS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Rate"
                  />
                  {formErrors.sellingPrice && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.sellingPrice}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleAddItem}
                className="bg-[#05014A] text-white px-4 py-2 rounded hover:bg-[#0A0A47] transition-colors w-full text-sm font-medium flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block print:block p-3 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="bg-gray-100 border border-gray-300 print:bg-transparent">
                <th className="p-3 text-left text-sm text-gray-700 font-semibold border border-gray-300">S.no.</th>
                <th className="p-3 text-left text-sm text-gray-700 font-semibold border border-gray-300">Item Name</th>
                <th className="p-3 text-sm text-gray-700 font-semibold border border-gray-300 text-center">Qty</th>
                <th className="p-3 text-sm text-gray-700 font-semibold border border-gray-300 text-center">Rate</th>
                <th className="p-3 text-sm text-gray-700 font-semibold border border-gray-300 text-center">Amount</th>
                <th className="p-3 text-sm text-gray-700 font-semibold border border-gray-300 print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={`desktop-${item.id}-${index}`} className="border border-gray-300 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-600 border border-gray-300">{index + 1}</td>
                  <td className="p-3 text-sm text-gray-800 font-medium border border-gray-300">{item.productName}</td>
                  <td className="p-3 text-sm text-gray-600 border border-gray-300 text-center">{item.quantity} {item.packingType}</td>
                  <td className="p-3 text-sm text-gray-600 border border-gray-300 text-center">₹{formatNumber(item.sellingPrice)}</td>
                  <td className="p-3 text-sm text-gray-800 font-medium border border-gray-300 text-center">₹{formatNumber(item.amount)}</td>
                  <td className="p-3 border border-gray-300 print:hidden">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors mx-auto block"
                      aria-label="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add Item Row */}
              <tr className="border border-gray-300 bg-blue-50 print:hidden">
                <td className="p-2 text-sm border border-gray-300"></td>
                <td className="p-2 border border-gray-300">
                  <div className="space-y-1">
                    <select
                      value={selectedProduct}
                      onChange={handleProductSelect}
                      className="w-full border rounded p-1 text-xs mb-1 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select Product</option>
                      {Data.map((product) => (
                        <option key={product.id} value={product.productName}>
                          {product.productName} - ₹{product.sellingPrice}
                        </option>
                      ))}
                    </select>
                    {formErrors.productName && (
                      <p className="text-red-500 text-xs">{formErrors.productName}</p>
                    )}
                    <input
                      type="text"
                      value={newItem.productName}
                      onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                      className="w-full border rounded p-1 text-sm"
                      placeholder="Item Name"
                    />
                  </div>
                </td>
                <td className="p-2 border border-gray-300">
                  <div className="flex space-x-1">
                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.001"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                        className="w-full border rounded p-1 text-sm"
                        placeholder="Qty"
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 text-xs">{formErrors.quantity}</p>
                      )}
                    </div>
                    <select
                      value={newItem.packingType}
                      onChange={(e) => setNewItem({...newItem, packingType: e.target.value})}
                      className="w-20 border rounded p-1 text-xs"
                    >
                      <option value="PCS">PCS</option>
                      <option value="KGS">KGS</option>
                    </select>
                  </div>
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                    className="w-full border rounded p-1 text-sm"
                    placeholder="Rate"
                  />
                  {formErrors.sellingPrice && (
                    <p className="text-red-500 text-xs">{formErrors.sellingPrice}</p>
                  )}
                </td>
                <td className="p-2 border border-gray-300">
                  <button
                    onClick={handleAddItem}
                    className="bg-[#05014A] text-white px-3 py-2 rounded hover:bg-[#0A0A47] transition-colors w-full text-sm font-medium flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </button>
                </td>
                <td className="border border-gray-300"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="p-3 text-right font-bold text-gray-700 border border-gray-300">Total:</td>
                <td className="p-3 text-right font-bold text-gray-700 border border-gray-300">
                  ₹{formatNumber(total)}
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="4" className="p-3 text-right text-gray-600 border border-gray-300">PACKING:</td>
                <td className="p-3 text-right text-gray-600 border border-gray-300">
                  <input
                    type="number"
                    value={packing}
                    onChange={(e) => setPacking(e.target.value)}
                    className="w-24 border rounded p-1 text-right print:border-none print:bg-transparent"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="4" className="p-3 text-right text-gray-600 border border-gray-300">FREIGHT:</td>
                <td className="p-3 text-right text-gray-600 border border-gray-300">
                  <input
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(e.target.value)}
                    className="w-24 border rounded p-1 text-right print:border-none print:bg-transparent"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="4" className="p-3 text-right text-gray-600 border border-gray-300">RIKSHA:</td>
                <td className="p-3 text-right text-gray-600 border border-gray-300">
                  <input
                    type="number"
                    value={riksha}
                    onChange={(e) => setRiksha(e.target.value)}
                    className="w-24 border rounded p-1 text-right print:border-none print:bg-transparent"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="4" className="p-3 text-right text-gray-600 border border-gray-300">ROUND OFF:</td>
                <td className="p-3 text-right text-gray-600 border border-gray-300">
                  ₹{roundOff.toFixed(2)}
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="4" className="p-3 text-right font-bold text-lg text-gray-800 border border-gray-300">Grand Total:</td>
                <td className="p-3 text-right font-bold text-lg text-gray-800 border border-gray-300">
                  ₹{grandTotal.toFixed(2)}
                </td>
                <td className="border border-gray-300 print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Total */}
        <div className="block sm:hidden print:hidden p-3 border-t bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold">₹{formatNumber(total)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>PACKING:</span>
              <input
                type="number"
                value={packing}
                onChange={(e) => setPacking(e.target.value)}
                className="w-24 border rounded p-1 text-right"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span>FREIGHT:</span>
              <input
                type="number"
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                className="w-24 border rounded p-1 text-right"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span>RIKSHA:</span>
              <input
                type="number"
                value={riksha}
                onChange={(e) => setRiksha(e.target.value)}
                className="w-24 border rounded p-1 text-right"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-medium">ROUND OFF:</span>
              <span>₹{roundOff.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="font-bold text-lg">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Print Actions */}
        <div className="p-3 sm:p-6 border-t flex justify-center sm:justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#05014A] hover:bg-[#0A0A47] text-white px-6 py-3 rounded-lg shadow-md transition-all flex items-center font-medium text-base"
          >
            <Printer size={20} className="mr-2" />
            Print Estimate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;