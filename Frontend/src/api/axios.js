// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend base URL
  withCredentials: true, // if you're using cookies (optional)
});

export default api;
