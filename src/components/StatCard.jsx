
import React from 'react';
import './Stat.css';

const StatCard = ({ title, value, bgColor }) => {
  return (
    <div className="stat-card" style={{ '--bg-color': bgColor }}>
      <h3>{title}</h3>
      <div className="value-circle">{value}</div>
    </div>
  );
};

export default StatCard;

