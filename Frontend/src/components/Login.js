import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const navigateToSignup= ()=>{
    navigate('/signup')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/login", form);
      localStorage.setItem("authToken", res.data.token);
      navigate("/chat"); // 🔁 Redirect to /chat
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full px-4 py-2 border rounded" />
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded">Login</button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button onClick={navigateToSignup} className="text-blue-700 underline">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
