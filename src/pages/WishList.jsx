import React from 'react';
import { useCart } from '../CartContext';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import SiteNavbar from "../components/SiteNavbar";
import '../styles/WishList.css';


const Wishlist = () => {
  const { wishlist, removeFromWishlist,moveToCart } = useCart();

  return (
    <>
    <SiteNavbar/>
     <Container
        className="pt-5 mt-5"
        style={{
          background: 'linear-gradient(135deg, #f8fafc, #9e4f90ff)',
          minHeight: '100vh',
        }}
      >
    {/* <Container className="mt-5" style={{   background: 'linear-gradient(135deg, #f8fafc, #9e4f90ff)',}}> */}
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <Alert variant="info" className="mt-4">
          Your wishlist is empty.
        </Alert>
      ) : (
        <Row className="mt-4">
          {wishlist.map((item) => (
            <Col md={4} className="mb-4" key={item.id}>
              <Card>
                {/* <Card.Img variant="top" src={item.image} alt={item.name} /> */}

                <Card.Img
  variant="top"
  src={`http://localhost:5000${item.image}`}
  alt={item.name}
  style={{
    height: '200px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  }}
  className="hover-zoom"
/>

                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>₹{item.price}</Card.Text>
                  <div className="d-flex gap-2">
                   
                    <Button
                      variant="danger"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </Button>
                    <Button variant="primary" onClick={() => moveToCart(item)}>
  Move to Cart
</Button>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </>
  );
};

export default Wishlist;
