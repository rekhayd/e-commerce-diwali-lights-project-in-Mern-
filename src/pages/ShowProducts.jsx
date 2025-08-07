

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error('Error fetching products:', err));

    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleWishlist = (product) => {
    const exists = wishlist.find(item => item._id === product._id);
    let updatedWishlist;

    if (exists) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      iziToast.info({ title: 'Removed', message: 'Removed from wishlist' });
    } else {
      updatedWishlist = [...wishlist, product];
      iziToast.success({ title: 'Added', message: 'Added to wishlist' });
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleBuyNow = (id) => {
    navigate(`/buy-now/${id}`);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">All Products</h2>
      <Row>
        {products.map(product => (
          <Col key={product._id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              {product.image && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${product.image}`}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>₹{product.price}</strong></Card.Text>

                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant="outline-danger"
                    onClick={() => handleWishlist(product)}
                  >
                    {wishlist.some(item => item._id === product._id) ? '❤️ Wishlisted' : '🤍 Wishlist'}
                  </Button>
                  <Button variant="success" onClick={() => handleBuyNow(product._id)}>
                    Buy Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShowProducts;
