import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Img
          variant="top"
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
          <Card.Text><strong>Price:</strong> ₹{product.price}</Card.Text>
          <Card.Text><strong>Description:</strong> {product.description || 'No description available.'}</Card.Text>
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetails;
