


import React, { useContext, useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { ThemeContext } from '../ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        const dataWithPrices = res.data.map(item => ({
          ...item,
          price: item.price || Math.floor(Math.random() * 300 + 100),
        }));
        setProducts(dataWithPrices);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container className="py-5">
      <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-light' : 'text-dark'}`}>
        Our Products
      </h2>

      <Row className="g-4">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4}>
            <Card
              className={`product-card shadow-sm h-100 border-0 rounded-4 overflow-hidden transition-all ${
                darkMode ? 'bg-dark text-light' : 'bg-white text-dark'
              }`}
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="overflow-hidden">
                <Card.Img
                  variant="top"
                  loading="lazy"
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  onError={(e) => e.target.src = '/fallback.jpg'} // fallback image
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease-in-out',
                  }}
                  className="w-100 hover-zoom"
                />
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-semibold fs-5">{product.name}</Card.Title>
                <h5 className="text-primary mb-3">₹{product.price}</h5>

                <Link to={`/product/${product._id}`} className="mt-auto text-decoration-none">
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    className="w-100 fw-semibold"
                  >
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductCard;
