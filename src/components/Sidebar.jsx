import React from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  return (
    <div style={{ width: '220px', background: '#111', color: '#fff', height: '533px', padding: '25px',marginTop:'15px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      
      </div>
      <ul style={{ listStyle: 'none', padding: 10 }}>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/user" style={{ color: '#fff', textDecoration: 'none' }}>Users</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/orders" style={{ color: '#fff', textDecoration: 'none' }}>Orders</Link>
        </li>

         <li style={{ margin: '10px 0' }}>
          <Link to="/reports" style={{ color: '#fff', textDecoration: 'none' }}>Report</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/logout" style={{ color: '#fff', textDecoration: 'none' }}>Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


