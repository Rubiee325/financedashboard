import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from '../../services/api';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import OrderForm from './OrderForm';
import Toast from '../ui/Toast';
import ConfirmationModal from '../ui/ConfirmationModal';

const OrderList = () => {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "viewer";

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState("all"); // ✅ NEW FILTER
  const [toasts, setToasts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ================= */

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= TOAST ================= */

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOrder(deleteId);
      showToast("Transaction deleted successfully");
      fetchOrders();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  /* ================= FILTER ================= */

  const filteredOrders = orders
    .filter(o =>
      `${o.firstName || ''} ${o.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.product || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(o => {
      if (filterType === "all") return true;

      const type = o.type;
      return type === filterType;
    });

  /* ================= LOADING ================= */

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-8 md:p-12 font-sans">

      {/* HEADER */}
      <div className="max-w-[1600px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

          <div>
            <h1 className="text-4xl font-black text-[#0F172A] mb-2">
              Transactions
            </h1>
            <p className="text-[#64748B] text-lg">
              View and manage transactions
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div className="bg-white border p-2.5 rounded-xl flex items-center gap-3 px-6 shadow-sm min-w-[250px]">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* ADMIN CREATE */}
            {role === "admin" && (
              <button
                onClick={() => { setEditingOrder(null); setIsFormOpen(true); }}
                className="bg-[#54bd95] text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            )}

          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm overflow-hidden">

        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No transactions found
          </div>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition">

                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{order.firstName} {order.lastName}</td>
                    <td className="px-4 py-3">{order.email}</td>
                    <td className="px-4 py-3">{order.product}</td>
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">
                      ₹{order.totalAmount}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      {role === "admin" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setEditingOrder(order); setIsFormOpen(true); }}
                            className="p-2 hover:bg-green-100 rounded"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteId(order._id)}
                            className="p-2 hover:bg-red-100 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* TOAST */}
      <Toast
        toasts={toasts}
        onClose={(id) => setToasts(t => t.filter(x => x.id !== id))}
      />

      {/* DELETE MODAL */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete"
        message="Are you sure?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* FORM */}
      {isFormOpen && (
        <OrderForm
          order={editingOrder}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchOrders();
          }}
        />
      )}

    </div>
  );
};

export default OrderList;