import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddInventoryProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    code: '',
    stock: '',
    packingType: 'Pc',
    costPrice: '',
    sellingPrice: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName) newErrors.productName = 'Product name is required';
    if (!formData.code) newErrors.code = 'Product code is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (!formData.costPrice) newErrors.costPrice = 'Cost price is required';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    
    // Additional validations
    if (Number(formData.costPrice) >= Number(formData.sellingPrice)) {
      newErrors.sellingPrice = 'Selling price must be greater than cost price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically make an API call to save the product
      console.log('Form submitted:', formData);
      // Navigate back to inventory page after successful submission
      navigate('/inventory');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#caf0f8] p-4 md:p-6">
        <div className="max-w-3xl mx-auto flex items-center">
          <button 
            onClick={() => navigate('/inventory')}
            className="flex items-center text-[#05014A] hover:text-[#03012e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="mr-2 cursor-pointer" size={20} />
            Back to Inventory
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#05014A] mb-6">Add New Product</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent ${
                    errors.productName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-500">{errors.productName}</p>
                )}
              </div>

              {/* Product Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                )}
              </div>

              {/* Packing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Packing Type
                </label>
                <select
                  name="packingType"
                  value={formData.packingType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent"
                >
                  <option value="Pc">Pc</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent ${
                    errors.costPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-red-500">{errors.costPrice}</p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#05014A] focus:border-transparent ${
                    errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.sellingPrice && (
                  <p className="mt-1 text-sm text-red-500">{errors.sellingPrice}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="flex items-center bg-[#05014A] text-white px-6 py-2 rounded-lg hover:bg-[#03012e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05014A]"
              >
                <Save className="mr-2" size={20} />
                Save Product
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddInventoryProduct;