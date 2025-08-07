import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {msg && <p className="text-blue-600 mb-2">{msg}</p>}
        <input
          type="email"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
