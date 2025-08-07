

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🛍 Product Listings</h2>
      <Row>
        {categories.map(category => {
          const imagePath = category.images?.[0] || category.image;
          return (
            <Col md={4} sm={6} xs={12} key={category._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                {imagePath ? (
                  <Card.Img variant="top" src={`http://localhost:5000${imagePath}`} alt={category.name} style={{ height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#f0f0f0' }}>
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{category.description}</Card.Text>
                  <p><strong>₹{category.price}</strong></p>
                  <div className="text-warning mb-2">{'★'.repeat(4)}☆</div>
                  <div className="d-flex justify-content-between">
                    {/* <Button variant="primary" onClick={() => navigate(`/category/${category._id}`)}>View Details</Button> */}
        
        
<Button
 variant="primary"
 onClick={() => navigate(`/category/${category.name}`)} // 👈 use category.name
>
 View Details
</Button>



                    <Button variant="success" onClick={() => navigate(`/buy-now/${category._id}`)}>Buy Now</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Categories;
