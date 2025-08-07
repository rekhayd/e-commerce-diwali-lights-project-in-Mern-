
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminProfile.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(res.data);

        // iziToast.success({
        //   title: 'Success',
        //   message: 'Admin profile loaded',
        //   position: 'topRight',
        // });
      } catch (err) {
        console.error('Failed to fetch admin profile', err);
        iziToast.error({
          title: 'Error',
          message: 'Failed to load admin profile',
          position: 'topRight',
        });
      }
    };
    fetchAdminProfile();
  }, []);

  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="profi-container">
        {admin ? (
          <div className="car hover-car">
            <div className="admi-details">
              <h2>Admin Profile</h2>
              <h3>{admin.name}</h3>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Role:</strong> {admin.role || 'Administrator'}</p>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </>
  );
};

export default AdminProfile;
