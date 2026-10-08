import axios from 'axios';

const API = axios.create({
  baseURL: 'https://deployed-smart-expense-splitter-mernstack.onrender.com/api',
});

// Request Interceptor: har request mein Token auto-attach karne ke liye
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;