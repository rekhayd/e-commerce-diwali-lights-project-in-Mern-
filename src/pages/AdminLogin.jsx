

import React, { useState } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      iziToast.success({ title: 'Success', message: 'Login Successful' });
      navigate('/admin/dashboard');
    } catch (error) {
      iziToast.error({ title: 'Error', message: error.response?.data?.message || 'Login Failed' });
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f4f4f4',
    }}>
      <div style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <form onSubmit={handleLogin}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

