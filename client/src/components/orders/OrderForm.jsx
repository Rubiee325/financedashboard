import React, { useState, useEffect } from 'react';
import { createOrder, updateOrder } from '../../services/api';
import { X, ChevronRight } from 'lucide-react';

const OrderForm = ({ order, onClose, onSuccess }) => {

  const initialData = {
    firstName: '', lastName: '', email: '', phone: '', streetAddress: '',
    city: '', state: '', postalCode: '', country: 'United States',
    product: 'Fiber Internet 300 Mbps',
    quantity: 1,
    unitPrice: 0,
    type: "expense",
    totalAmount: 0,
    status: 'Pending',
    createdBy: 'Mr. Michael Harris'
  };

  const [formData, setFormData] = useState(order || initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: prev.quantity * prev.unitPrice
    }));
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'unitPrice')
        ? Number(value)
        : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const requiredFields = [
      "firstName", "lastName", "email", "phone",
      "streetAddress", "city", "state", "postalCode",
      "country", "product", "quantity", "unitPrice",
      "status", "createdBy"
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill all required fields");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      let response;

      if (order?._id) {
        response = await updateOrder(order._id, formData);
        const shortId = order._id.slice(-6).toUpperCase();
        onSuccess(`Order ORD-${shortId} updated successfully`);
      } else {
        response = await createOrder(formData);
        const shortId = response.data.data._id.slice(-6).toUpperCase();
        onSuccess(`Order ORD-${shortId} created successfully`);
      }

    } catch (error) {
      console.error("Order save error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-bold">
            {order ? "Edit Order" : "Create Order"}
          </h3>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">

          {/* NAME */}
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input" />
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-2 gap-4">
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input" />
          </div>

          {/* PRODUCT */}
          <select name="product" value={formData.product} onChange={handleChange} className="input">
            <option>Fiber Internet 300 Mbps</option>
            <option>5GUnlimited Mobile Plan</option>
            <option>Fiber Internet 1 Gbps</option>
            <option>Business Internet 500 Mbps</option>
            <option>VoIP Corporate Package</option>
          </select>

          {/* QUANTITY + PRICE */}
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input" />
            <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="input" />
          </div>

          {/* TYPE */}
          <select name="type" value={formData.type} onChange={handleChange} className="input">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* TOTAL */}
          <div className="p-3 bg-gray-100 rounded font-bold">
            Total: ₹{formData.totalAmount}
          </div>

          {/* STATUS */}
          <select name="status" value={formData.status} onChange={handleChange} className="input">
            <option>Pending</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>

            <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded">
              {order ? "Update" : "Create"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default OrderForm;