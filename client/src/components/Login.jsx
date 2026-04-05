import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    setError("");

    if (!form.email || !form.password) {
      return setError("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >

        {/* 🔥 APP NAME */}
        <h1 className="text-xl font-black text-center text-[#54bd95] mb-1">
          Dashboard Builder
        </h1>

        {/* 🔥 TAGLINE */}
        <p className="text-xs text-gray-400 text-center mb-4">
          Build your custom analytics dashboard
        </p>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0F172A]">
          Welcome Back
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#54bd95]"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#54bd95]"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#54bd95] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#54bd95] font-semibold">
            Sign Up
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;