

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/DashboardCard.css';



const DashboardCard = ({ title, count, icon, link }) => {
  return (
    <Card className="shadow h-100 text-center">
      <Card.Body>
        <div style={{ fontSize: '2.5rem' }}>{icon}</div>
        <Card.Title className="mt-3">{title}</Card.Title>
        <Card.Text className="fw-bold fs-4">{count}</Card.Text>
        <Link to={link}>
          <Button variant="primary" size="sm">View All</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default DashboardCard;
