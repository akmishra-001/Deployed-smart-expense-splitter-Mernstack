import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(Array.isArray(res.data) ? res.data : res.data.groups || []);
    } catch (err) {
      console.error('Fetch groups error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/groups',
        { name: groupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Group created successfully!');
      setGroupName('');
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating group');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/groups/join',
        { inviteCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Joined group successfully!');
      setInviteCode('');
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error joining group');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading groups...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Expense Splitter Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Group Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="flex gap-2">
              <input
                type="text"
                placeholder="Group Name (e.g. Goa Trip)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Create
              </button>
            </form>
          </div>

          {/* Join Group Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Join Group via Code</h2>
            <form onSubmit={handleJoinGroup} className="flex gap-2">
              <input
                type="text"
                placeholder="Invite Code (e.g. A1B2C3)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Groups List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
          {groups.length === 0 ? (
            <p className="text-gray-500">No groups found. Create or join one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((g) => (
                <Link
                  key={g._id}
                  to={`/group/${g._id}`}
                  className="block p-4 border rounded hover:border-blue-500 transition hover:shadow-sm bg-white"
                >
                  <h3 className="font-bold text-lg text-blue-600">{g.name}</h3>
                  <p className="text-sm text-gray-500">Members: {g.members?.length || 1}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;