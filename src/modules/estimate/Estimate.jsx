import { useState, useEffect } from 'react';
import { Printer, Plus, Trash2 } from 'lucide-react';

import Data from '../data/Data';

const Estimate = () => {
  const [estimateItems, setEstimateItems] = useState([]);
  const [newItem, setNewItem] = useState({
    id: '',
    productName: '',
    quantity: '',
    packingType: 'pc',
    sellingPrice: '',
  });
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');

  // Process initial data to include calculated fields
  useEffect(() => {
    const processedData = Data.map((item, index) => {
      const quantity = item.quantity;
      const baseAmount = quantity * item.sellingPrice;
      const gst = parseFloat((baseAmount * 0.18).toFixed(2));
      const totalAmount = parseFloat((baseAmount + gst).toFixed(2));
      
      return {
        ...item,
        quantity: quantity,
        baseAmount: baseAmount,
        gst: gst,
        amount: totalAmount
      };
    });
    setEstimateItems(processedData);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [estimateItems]);

  const calculateTotal = () => {
    const sum = estimateItems.reduce((acc, item) => {
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
          packingType: product.packingType
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

  const handleAddItem = () => {
    if (!newItem.productName || !newItem.quantity || !newItem.sellingPrice) {
      alert('Please fill all fields');
      return;
    }
  
    const quantity = parseFloat(newItem.quantity);
    const sellingPrice = parseFloat(newItem.sellingPrice);
    
    if (isNaN(quantity) || isNaN(sellingPrice) || quantity <= 0 || sellingPrice <= 0) {
      alert('Please enter valid quantity and selling price');
      return;
    }
    
    // Calculate base amount (before GST)
    const baseAmount = quantity * sellingPrice;
    
    // Calculate GST (18%)
    const gst = parseFloat((baseAmount * 0.18).toFixed(2));
    
    // Calculate total amount (including GST)
    const totalAmount = parseFloat((baseAmount + gst).toFixed(2));
  
    const newEstimateItem = {
      id: newItem.id || Date.now(), // Generate ID if not provided
      productName: newItem.productName,
      quantity: quantity,
      packingType: newItem.packingType,
      sellingPrice: sellingPrice,
      baseAmount: baseAmount,
      gst: gst,
      amount: totalAmount
    };
  
    setEstimateItems([...estimateItems, newEstimateItem]);
    setNewItem({
      id: '',
      productName: '',
      quantity: '',
      packingType: 'pc',
      sellingPrice: ''
    });
    setSelectedProduct('');
  };

  const handleDeleteItem = (indexToDelete) => {
    const newItems = estimateItems.filter((_, index) => index !== indexToDelete);
    setEstimateItems(newItems);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper function to safely format numbers
  const formatNumber = (value) => {
    return (parseFloat(value) || 0).toFixed(2);
  };

  return (
    <div className="p-2 sm:p-6 min-h-screen bg-gray-50">
      <div className="max-w-[1040px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-3 sm:p-6 border-b">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            {/* Company Info */}
            <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-[#05014A] flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">AGS</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-[#05014A]">
                  Amit General Stores
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  4453, Goenka Dharamshala, Ramghat
                </p>
                <p className="text-sm sm:text-base text-gray-600">Panchvati, Nashik - 422003</p>
                <p className="text-sm sm:text-base text-gray-600">Ph: 9595581555</p>
                <p className="text-sm sm:text-base text-gray-600">GST: 29GGGGG1314R9Z6</p>
              </div>
            </div>

            {/* Estimate Details */}
            <div className="text-left lg:text-right w-full lg:w-auto">
              <h2 className="text-lg sm:text-2xl font-bold text-[#05014A]">Estimate</h2>
              <p className="mt-2 text-sm sm:text-base">Estimate No: EST-000232</p>
              <p className="text-sm sm:text-base">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-sm sm:text-base">Time: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Mobile Card View for Small Screens */}
        <div className="block sm:hidden p-3">
          {estimateItems.map((item, index) => (
            <div key={`mobile-${item.id}-${index}`} className="bg-gray-50 rounded-lg p-3 mb-3 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">{item.productName}</h3>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Qty: </span>
                  <span>{item.quantity} {item.packingType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Selling Price: </span>
                  <span>₹{formatNumber(item.sellingPrice)} /{item.packingType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Base Amount: </span>
                  <span>₹{formatNumber(item.baseAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">GST (18%): </span>
                  <span>₹{formatNumber(item.gst)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Total Amount: </span>
                  <span className="font-semibold">₹{formatNumber(item.amount)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Add Item Form */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <h4 className="font-semibold mb-3 text-[#05014A]">Add New Item</h4>
            <div className="space-y-3">
              <select
                value={selectedProduct}
                onChange={handleProductSelect}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Select Product</option>
                {Data.map((product) => (
                  <option key={product.id} value={product.productName}>
                    {product.productName} - ₹{product.sellingPrice}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={newItem.productName}
                onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                className="w-full border rounded p-2 text-sm"
                placeholder="Product Name"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Quantity"
                />
                <select
                  value={newItem.packingType}
                  onChange={(e) => setNewItem({...newItem, packingType: e.target.value})}
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="pc">pc</option>
                  <option value="kg">kg</option>
                  <option value="gm">gm</option>
                  <option value="ltr">ltr</option>
                  <option value="box">box</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.sellingPrice}
                  onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Selling Price"
                />
              </div>
              
              <button
                onClick={handleAddItem}
                className="bg-[#05014A] text-white px-4 py-2 rounded hover:bg-[#0A0A47] transition-colors w-full text-sm"
              >
                <Plus size={16} className="inline mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block p-3 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#05014A] text-white">
              <tr>
                <th className="p-2 sm:p-3 text-left text-sm">No.</th>
                <th className="p-2 sm:p-3 text-left text-sm">Product Name</th>
                <th className="p-2 sm:p-3 text-right text-sm">Quantity</th>
                <th className="p-2 sm:p-3 text-right text-sm">Selling Price</th>
                <th className="p-2 sm:p-3 text-right text-sm">Base Amount</th>
                <th className="p-2 sm:p-3 text-right text-sm">GST (18%)</th>
                <th className="p-2 sm:p-3 text-right text-sm">Amount</th>
                <th className="p-2 sm:p-3 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {estimateItems.map((item, index) => (
                <tr key={`desktop-${item.id}-${index}`} className="border-b">
                  <td className="p-2 sm:p-3 text-sm">{index + 1}.</td>
                  <td className="p-2 sm:p-3 text-sm">{item.productName}</td>
                  <td className="p-2 sm:p-3 text-right text-sm">{item.quantity} {item.packingType}</td>
                  <td className="p-2 sm:p-3 text-right text-sm">₹{formatNumber(item.sellingPrice)} /{item.packingType}</td>
                  <td className="p-2 sm:p-3 text-right text-sm">₹{formatNumber(item.baseAmount)}</td>
                  <td className="p-2 sm:p-3 text-right text-sm">₹{formatNumber(item.gst)}</td>
                  <td className="p-2 sm:p-3 text-right text-sm">₹{formatNumber(item.amount)}</td>
                  <td className="p-2 sm:p-3">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add Item Row */}
              <tr className="border-b bg-gray-50">
                <td className="p-2 sm:p-3 text-sm">{estimateItems.length + 1}.</td>
                <td className="p-2 sm:p-3">
                  <div className="space-y-1">
                    <select
                      value={selectedProduct}
                      onChange={handleProductSelect}
                      className="w-full border rounded p-1 text-xs mb-1"
                    >
                      <option value="">Select Product</option>
                      {Data.map((product) => (
                        <option key={product.id} value={product.productName}>
                          {product.productName} - ₹{product.sellingPrice}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newItem.productName}
                      onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                      className="w-full border rounded p-1 sm:p-2 text-sm"
                      placeholder="Product Name"
                    />
                  </div>
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      className="w-16 border rounded p-1 text-sm"
                      placeholder="Qty"
                    />
                    <select
                      value={newItem.packingType}
                      onChange={(e) => setNewItem({...newItem, packingType: e.target.value})}
                      className="w-12 border rounded p-1 text-xs"
                    >
                      <option value="pc">pc</option>
                      <option value="kg">kg</option>
                      <option value="gm">gm</option>
                      <option value="ltr">ltr</option>
                      <option value="box">box</option>
                    </select>
                  </div>
                </td>
                <td className="p-2 sm:p-3">
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                    className="w-full border rounded p-1 sm:p-2 text-sm"
                    placeholder="Price"
                  />
                </td>
                <td colSpan="2" className="p-2 sm:p-3">
                  <button
                    onClick={handleAddItem}
                    className="bg-[#05014A] text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-[#0A0A47] transition-colors w-full text-sm"
                  >
                    <Plus size={16} className="inline mr-1 sm:mr-2" />
                    Add Product
                  </button>
                </td>
                <td></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan="6" className="p-2 sm:p-3 text-right font-bold text-sm sm:text-base">Total:</td>
                <td className="p-2 sm:p-3 text-right font-bold text-sm sm:text-base">
                  ₹{formatNumber(total)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Total */}
        <div className="block sm:hidden p-3 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-[#05014A]">₹{formatNumber(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-6 border-t flex justify-center sm:justify-end">
          <button
            onClick={handlePrint}
            className="bg-[#05014A] text-white px-4 sm:px-6 py-2 rounded hover:bg-[#0A0A47] transition-colors flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Printer size={16} className="mr-2" />
            Print Estimate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Estimate;