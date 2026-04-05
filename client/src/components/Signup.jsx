import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await signup({
        name: form.name,
        email: form.email,
        password: form.password
      });

      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">

      <form
        onSubmit={handleSignup}
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
          Create Account
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#54bd95]"
        />

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
          className="w-full mb-3 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#54bd95]"
        />

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#54bd95]"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#54bd95] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* LOGIN */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#54bd95] font-semibold">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Signup;