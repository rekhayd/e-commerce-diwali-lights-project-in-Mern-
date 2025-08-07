


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CategoryCards = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories'); 
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    
    <Container className="mt-4">
        <h2 style={{marginLeft:"380px"}}>Explore Categories </h2>
      <Row>
        {categories.map((cat, index) => (
          <Col key={index} md={4}>
            <Card
              className="mb-4 shadow-sm"
              onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img
                variant="top"
                src={`http://localhost:5000${cat.image}`}
                alt={cat.name}
                height={200}
                
                style={{
                    height: '200px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  className="hover-zoom"
              />
              <Card.Body>
                <Card.Title>{cat.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryCards;
