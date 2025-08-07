

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import { ThemeContext } from '../ThemeContext';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OurProducts = () => {
  const { addToCart, addToWishlist } = useCart();
  const { darkMode } = useContext(ThemeContext);

  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const filtered = categories.filter(item =>
    (categoryFilter === 'All' || item.category === categoryFilter) &&
    (maxPrice === '' || item.price <= parseInt(maxPrice))
  );

  return (
    <Container
      className={`mt-5 ${darkMode ? 'text-light bg-dark' : ''}`}
      style={{ background: 'linear-gradient(135deg, #f8fafc, #aa4f96ff)' }}
    >
      <h2 className="mb-4">Our Products</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Dream">Dream Home Lights</option>
            <option value="Office">Office Lights</option>
            <option value="Gifts">Gifts Lights</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>₹</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {filtered.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Card className={darkMode ? 'bg-secondary text-light' : ''}>
              <Card.Img
                variant="top"
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
              />

              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>₹{item.price}</Card.Text>

                <div className="d-flex gap-2 flex-wrap">
                  <Button variant="success" onClick={() => addToCart(item)}>Add to Cart</Button>
                  <Button variant="warning" onClick={() => addToWishlist(item)}>Wishlist</Button>

                  <Link to={`/product/${item._id}`}>
                    <Button variant="info">View Product</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OurProducts;

