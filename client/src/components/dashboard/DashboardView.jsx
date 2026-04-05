import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getDashboardConfig, getOrders } from '../../services/api';
import { Settings, Download, Moon, Sun } from 'lucide-react';

import KPIWidget from './widgets/KPIWidget';
import ChartWidget from './widgets/ChartWidget';
import TableWidget from './widgets/TableWidget';

import { useTheme } from '../../context/ThemeContext';
import { exportToPDF } from '../../utils/exportUtils';

const DashboardView = () => {

  const navigate = useNavigate();

  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const toggleTheme = themeContext?.toggleTheme || (() => {});

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "viewer";

  const [config, setConfig] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('All time');
  const [filterType, setFilterType] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = React.useMemo(() => io('http://localhost:5000'), []);

  const transformData = (data) => {
    return data.map(o => ({
      date: o.createdAt,
      amount: o.totalAmount || 0,
      category: o.product,
      type: o.type || (o.totalAmount > 3000 ? "income" : "expense")
    }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [configRes, ordersRes] = await Promise.all([
        getDashboardConfig(),
        getOrders()
      ]);

      const dashboardConfig =
        configRes.data?.data || configRes.data || {};

      let orderData =
        ordersRes?.data?.data || ordersRes?.data || [];

      const now = new Date();

      if (dateRange !== "All time") {
        orderData = orderData.filter(order => {
          const created = new Date(order.createdAt);

          if (dateRange === "Today") {
            return created.toDateString() === now.toDateString();
          }

          if (dateRange === "Last 7 Days") {
            return (now - created) <= 7 * 86400000;
          }

          if (dateRange === "Last 30 Days") {
            return (now - created) <= 30 * 86400000;
          }

          return true;
        });
      }

      const transactions = transformData(orderData);

      setConfig(dashboardConfig);
      setOrders(transactions);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }

  }, [dateRange]);

  useEffect(() => {
    console.log("CONFIG:", config);
  }, [config]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();

    socket.on('order_added', fetchData);
    socket.on('order_updated', fetchData);
    socket.on('order_deleted', fetchData);

    return () => {
      socket.off('order_added');
      socket.off('order_updated');
      socket.off('order_deleted');
    };

  }, [fetchData, navigate]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <h2 className="text-red-500 text-center mt-20">{error}</h2>;

  const filteredOrders = orders.filter(o => {
    if (filterType === "all") return true;
    return o.type === filterType;
  });

  const income = filteredOrders.filter(o => o.type === "income").reduce((a,b)=>a+b.amount,0);
  const expense = filteredOrders.filter(o => o.type === "expense").reduce((a,b)=>a+b.amount,0);

  // ✅ FIX: top category clean
  const topCategory =
    Object.entries(
      orders.reduce((acc, o) => {
        if (o.type === "expense") {
          acc[o.category] = (acc[o.category] || 0) + o.amount;
        }
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // ✅ Monthly comparison
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const currentMonthTotal = orders
  .filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  })
  .reduce((sum, o) => sum + o.amount, 0);

const lastMonthTotal = orders
  .filter(o => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear;
  })
  .reduce((sum, o) => sum + o.amount, 0);

// % change
const percentageChange =
  lastMonthTotal === 0
    ? 0
    : (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1);

// ✅ Smart message
const insightMessage =
  percentageChange > 0
    ? `📈 Spending increased by ${percentageChange}% compared to last month`
    : percentageChange < 0
    ? `📉 Spending decreased by ${Math.abs(percentageChange)}% compared to last month`
    : "📊 No change compared to last month";

  return (
    <div
  id="dashboard-content"
  className={`min-h-screen p-10 transition-colors ${
    isDarkMode ? "bg-[#0B1733] text-white" : "bg-[#F7F9FC] text-black"
  }`}
>

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">💰 Finance Dashboard</h1>

        <div className="flex gap-4 items-center">
          <span className="px-3 py-1 border rounded text-sm">
            Role: {role}
          </span>

          <button onClick={toggleTheme}>
            {isDarkMode ? <Sun /> : <Moon />}
          </button>

          <button onClick={() => exportToPDF(filteredOrders, config)}>
            <Download />
          </button>

          {role === "admin" && (
            <button onClick={() => navigate('/configure')}>
              <Settings />
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-sm">Time:</span>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm text-black"
        >
          <option>All time</option>
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>

        <span className="text-sm">Transaction type:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-1 rounded text-sm text-black"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-6 rounded-2xl shadow`}>
          <p className="text-sm opacity-70">💰 Income</p>
          <h2 className="text-3xl font-bold mt-3 text-green-500">₹{income}</h2>
        </div>

        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-6 rounded-2xl shadow`}>
          <p className="text-sm opacity-70">💸 Expense</p>
          <h2 className="text-3xl font-bold mt-3 text-red-400">₹{expense}</h2>
        </div>

        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-6 rounded-2xl shadow`}>
          <p className="text-sm opacity-70">📊 Balance</p>
          <h2 className="text-3xl font-bold mt-3 text-blue-400">₹{income - expense}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-5 rounded-xl shadow`}>
          <p className="text-sm text-gray-400">Top Spending Category</p>
          <h2 className="text-lg font-bold mt-2 truncate max-w-[180px]">
            {topCategory}
          </h2>
        </div>

        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-5 rounded-xl shadow`}>
          <p className="text-sm text-gray-400">Highest Transaction</p>
          <h2 className="text-xl font-bold mt-2">
            ₹{Math.max(...orders.map(o => o.amount || 0), 0)}
          </h2>
        </div>

        <div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-5 rounded-xl shadow`}>
          <p className="text-sm text-gray-400">Total Transactions</p>
          <h2 className="text-xl font-bold mt-2">
            {orders.length}
          </h2>
        </div>
        {/* ADVANCED INSIGHTS */}
<div className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} p-6 rounded-xl shadow mt-6`}>
  <h2 className="font-bold mb-3">📊 Monthly Insight</h2>

  <p className="text-sm opacity-70 mb-2">
    Current Month: ₹{currentMonthTotal}
  </p>

  <p className="text-sm opacity-70 mb-2">
    Last Month: ₹{lastMonthTotal}
  </p>

  <p className="mt-3 font-semibold">
    {insightMessage}
  </p>
</div>

      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {config?.widgets?.map(widget => (
          <div key={widget.id || widget.title} className={`${isDarkMode ? "bg-[#1E293B]" : "bg-white"} rounded-xl p-5 shadow`}>
            <h3 className="font-bold mb-3">{widget.title}</h3>

            {widget.type === "KPI" && <KPIWidget widget={widget} orders={filteredOrders} />}
            {widget.type === "Table" && <TableWidget orders={filteredOrders} role={role} />}
            {widget.type === "Chart" && <ChartWidget widget={widget} orders={filteredOrders} />}
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardView;