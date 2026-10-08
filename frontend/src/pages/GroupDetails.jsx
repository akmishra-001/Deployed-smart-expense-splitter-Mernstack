import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Group Info
      try {
        const groupRes = await axios.get(`http://localhost:5000/api/groups/${id}`, { headers });
        setGroup(groupRes.data);
      } catch (gErr) {
        setGroup({ _id: id, name: 'Group Details', members: [] });
      }

      // 2. Fetch Expenses
      try {
        const expRes = await axios.get(`http://localhost:5000/api/expenses/${id}`, { headers });
        const expData = expRes.data;
        if (Array.isArray(expData)) setExpenses(expData);
        else if (expData?.data) setExpenses(expData.data);
        else setExpenses([]);
      } catch (eErr) {
        setExpenses([]);
      }

      // 3. Fetch Balances & Settlements
      try {
        const balRes = await axios.get(`http://localhost:5000/api/balances/${id}`, { headers });
        const rawData = balRes.data;
        if (Array.isArray(rawData)) {
          setBalances(rawData);
        } else if (rawData && Array.isArray(rawData.settlements)) {
          setBalances(rawData.settlements);
        } else {
          setBalances([]);
        }
      } catch (bErr) {
        setBalances([]);
      }

    } catch (err) {
      console.error('Error in fetchGroupData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/expenses',
        { groupId: id, description, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Expense added successfully!');
      setDescription('');
      setAmount('');
      fetchGroupData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Expense deleted!');
      fetchGroupData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleSettleUp = async (fromId, toId, settleAmount) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/balances/settle',
        { groupId: id, from: fromId, to: toId, amount: settleAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Settlement recorded successfully!');
      fetchGroupData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error settling up');
    }
  };

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      toast.info('Invite code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading group details...</div>;
  }

  // Filter out settlement entries from normal expense list view
  const visibleExpenses = expenses.filter((exp) => exp.description !== 'Settlement Payment');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-blue-600 hover:underline font-medium">
            &larr; Back to Dashboard
          </Link>

          {group?.inviteCode && (
            <div className="bg-white px-4 py-2 rounded shadow-sm flex items-center gap-2 border">
              <span className="text-sm text-gray-500">Invite Code:</span>
              <strong className="text-gray-800 tracking-wider font-mono">{group.inviteCode}</strong>
              <button
                onClick={copyInviteCode}
                className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-semibold"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800">{group?.name || 'Group Details'}</h1>

        {/* Add Expense Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Description (e.g. Hotel Booking)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition py-2"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Expense History (Settlements Filtered Out) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          {visibleExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {visibleExpenses.map((exp, idx) => (
                <li key={exp._id || idx} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                  <div>
                    <p className="font-semibold text-gray-800">{exp.description}</p>
                    <p className="text-sm text-gray-500">
                      Paid by: {exp.paidBy?.name || 'User'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">₹{exp.amount}</span>
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      title="Delete Expense"
                      className="text-red-500 hover:text-red-700 p-1.5 rounded transition hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Group Balances / Settlements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Balances & Settlements</h2>
          {!Array.isArray(balances) || balances.length === 0 ? (
            <p className="text-gray-500">All settled up!</p>
          ) : (
            <ul className="space-y-3">
              {balances.map((b, idx) => (
                <li key={idx} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                  <span className="text-sm">
                    <strong className="text-red-600">{b.fromName || 'Member'}</strong> owes{' '}
                    <strong className="text-green-600">{b.toName || 'Member'}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">₹{b.amount}</span>
                    <button
                      onClick={() => handleSettleUp(b.from, b.to, b.amount)}
                      className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700 font-semibold transition"
                    >
                      Settle Up
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;