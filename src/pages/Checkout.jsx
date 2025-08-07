
import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const CheckoutPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      ...orderDetails,
      cartItems,
      orderDate: new Date().toLocaleString(),
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Optional: clear cart
    cartItems.forEach(item => removeFromCart(item._id));
    alert('Order placed successfully!');
    setOrderDetails({ name: '', email: '', address: '', phone: '' });
  };

  return (
    <Container className="py-5">
      <h2>Checkout</h2>
      <Form onSubmit={handleOrderSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={orderDetails.name} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={orderDetails.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={orderDetails.phone} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={orderDetails.address} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="success" type="submit">Place Order</Button>
      </Form>

      <hr className="my-5" />

      <h4>Previous Orders</h4>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>Order #{index + 1}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{order.orderDate}</Card.Subtitle>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.cartItems.map((item) => (
                  <li key={item._id}>
                    {item.title} (x{item.quantity}) - ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default CheckoutPage;

