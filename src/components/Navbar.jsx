import React from 'react';
import logo from '../assets/ligh.jpeg'; 

const Navbar = () => {
  return (
    <div style={{ 
      height: '60px',
      background: '#eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <img
        src={logo}
        alt="Admin Logo"
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          objectFit: 'cover',
          
                 border: '4px solid #FFD700',
                boxSizing: 'border-box',
            
        }}
      />

      {/* Centered Title */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {/* <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Dashboard</h2> */}
      </div>
    </div>
  );
};

export default Navbar;
