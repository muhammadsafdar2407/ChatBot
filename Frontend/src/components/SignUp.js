import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", pin: "" });
  const [pinError, setPinError] = useState("");
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clear pin error when user starts typing
    if (e.target.name === "pin") {
      setPinError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate 6-digit PIN
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(form.pin)) {
      setPinError("PIN must be exactly 6 digits.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/signup", form);
      localStorage.setItem("authToken", res.data.token);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setPinError("Signup failed. Please try again."); // optional fallback
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <div>
            <input
              type="password"
              name="pin"
              value={form.pin}
              onChange={handleChange}
              placeholder="6-digit PIN"
              required
              className={`w-full px-4 py-2 border rounded ${pinError ? 'border-red-500' : ''}`}
            />
            {pinError && (
              <p className="text-red-600 text-sm mt-1">{pinError}</p>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button onClick={navigateToLogin} className="text-blue-700 underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
