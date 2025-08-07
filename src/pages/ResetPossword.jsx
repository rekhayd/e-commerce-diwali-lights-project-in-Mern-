import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/reset-password', {
        token,
        newPassword,
      });
      setMsg(res.data.message);
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {msg && <p className="text-green-600 mb-2">{msg}</p>}
        <input
          type="password"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white p-2 rounded">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
