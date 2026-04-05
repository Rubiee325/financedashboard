import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, Settings, Menu } from 'lucide-react';
import { LogOut } from "lucide-react";

const Layout = () => {

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // ✅ better than window.location

  // ✅ Get user from localStorage (dynamic)
  const userData = JSON.parse(localStorage.getItem("user"));

const user = {
  name: userData?.name || "User",
  role: userData?.role || "Viewer"
};
 {user.name?.charAt(0).toUpperCase()}

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${collapsed ? "w-20" : "w-72"} bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300`}
      >

        {/* Logo + Toggle */}
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold text-[#0F172A]">
              Dashboard Builder  {/* ✅ UPDATED NAME */}
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu */}
       <nav className="flex-1 px-4 space-y-2 mt-4">
  <SideLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} />
  <SideLink to="/orders" icon={<ShoppingCart size={20} />} label="Customer Transactions" collapsed={collapsed} />

  {/* ✅ ADMIN ONLY */}
  {user.role === "admin" && (
    <SideLink to="/configure" icon={<Settings size={20} />} label="Configuration" collapsed={collapsed} />
  )}
</nav>

        {/* User */}
        {!collapsed && (
          <div className="p-4">
            <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#54bd95] text-white flex items-center justify-center rounded-full font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role || "User"}</p>
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-bold"
  >
    <LogOut size={18} />
    {!collapsed && <span>Logout</span>}
  </button>
</div>

      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">

          {/* Optional Title */}
          <h2 className="text-lg font-semibold text-gray-700">
            {location.pathname.replace("/", "").toUpperCase()}
          </h2>

        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}   // ✅ FIXED
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/* Side Link */
const SideLink = ({ to, icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-[#54bd95] text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export default Layout;