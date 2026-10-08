import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  // Safe JSON Parsing to prevent blank screen errors
  let user = null;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined') {
      user = JSON.parse(savedUser);
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md py-3 px-8 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide hover:opacity-90">
        💰 Expense Splitter
      </Link>
      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            👤 {user.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded transition shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;