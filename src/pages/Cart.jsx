

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/cart.css'; 
import { color } from 'framer-motion';

const CartPage = () => {
  const {
    cartItems,
    incrementQty,
    decrementQty,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center" >
        <h2>Your Cart is Empty</h2>
        <Button onClick={() => navigate('/banner')} className="mt-3">
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Your Shopping Cart</h2>
      {cartItems.map((item) => (
        <Card className="mb-3 p-3 shadow-sm" key={item._id}>
          <Row className="align-items-center">
            <Col md={2}>
              <img
              
                 src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="img-fluid rounded"
              />
             
            </Col>
            <Col md={4}>
              <h5>{item.name}</h5>
              <p>Price: ₹{item.price}</p>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center">
                <Button variant="outline-secondary" onClick={() => decrementQty(item._id)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="outline-secondary" onClick={() => incrementQty(item._id)}>+</Button>
              </div>
            </Col>
            <Col md={2}>
              <strong>₹{item.price * item.quantity}</strong>
            </Col>
         
             <Col md={1}>
                       <Button variant="danger" onClick={() => removeFromCart(item._id)}>🗑</Button>
                    </Col>
          </Row>
        </Card>
      ))}

      <div className="text-end mt-4">
        <h4>Subtotal: ₹{subtotal.toFixed(2)}</h4>
        
    <Button
  variant="success"
  className="mt-2"
 
//   onClick={() => navigate(`/buy-now/${cartItems[0]._id}`)}

onClick={() => {
 const ids = cartItems.map(item => item._id).join(',');
 navigate(`/buy-now?ids=${ids}`);
}}


 >
  Proceed to Checkout
</Button>


      </div>
    </Container>
  );
};

export default CartPage;
