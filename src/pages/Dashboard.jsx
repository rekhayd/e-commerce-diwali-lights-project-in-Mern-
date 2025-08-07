import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

// Card component
const StatCard = ({ title, value, bgColor }) => {
  return (
    <div style={{
      backgroundColor: bgColor,
      borderRadius: '10px',
      padding: '20px',
      margin: '10px',
      flex: '1 1 200px',
      textAlign: 'center',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
    }}>
      <h3>{title}</h3>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 10px auto',
        fontSize: '20px',
        fontWeight: 'bold',
      }}>
        {value}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/admin/dashboard-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <Sidebar />

        <div style={{ flex: 1, padding: '30px',marginTop:'65px' }}>
          <h2 style={{marginLeft:'180px'}}>Welcome to Admin Dashboard</h2>
          <div style={{
 display: 'flex',
 flexWrap: 'wrap',
 gap: '20px',
 justifyContent: 'center',
 }}>

         
            <StatCard title="Total Users" value={stats.totalUsers} bgColor="  #0d6efd " />
            <StatCard title="Total Orders" value={stats.totalOrders} bgColor="#6610f2" />
            <StatCard title="Revenue" value={`₹ ${stats.totalRevenue}`} bgColor="#20c997" />
            <StatCard title="Total Products" value={stats.totalProducts} bgColor="#fd7e14" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
