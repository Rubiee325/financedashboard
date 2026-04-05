import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";

import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardView from "./components/dashboard/DashboardView";
import ConfigCanvas from "./components/dashboard/ConfigCanvas";
import OrderList from "./components/orders/OrderList";
const isAuthenticated = () => {
  return localStorage.getItem("token");
};




function App() {
  return (
  <Routes>

    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Root Redirect */}
    <Route
      path="/"
      element={
        localStorage.getItem("token")
          ? <Navigate to="/dashboard" />
          : <Navigate to="/login" />
      }
    />

    {/* Layout Wrapper (Protected) */}
    <Route
      path="/"
      element={
        localStorage.getItem("token")
          ? <Layout />
          : <Navigate to="/login" />
      }
    >

      {/* Default page */}
      <Route index element={<DashboardView />} />

      {/* Pages inside layout */}
      <Route path="dashboard" element={<DashboardView />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="configure" element={<ConfigCanvas />} />

    </Route>

    {/* Fallback (IMPORTANT for Vercel) */}
    <Route path="*" element={<Navigate to="/" />} />

  </Routes>
);
}

export default App;