

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SiteNavbar from '../components/SiteNavbar';

const BuyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerAddress: '',
    quantity: 1,
  });



  useEffect(() => {
  const query = new URLSearchParams(location.search);
  const ids = query.get('ids');

  if (ids) {
    // Multiple products
    const productIds = ids.split(',');
    axios.post('http://localhost:5000/api/products/bulk', { ids: productIds })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err);
        iziToast.error({ title: 'Error', message: 'Failed to load products' });
      });
  } else if (id) {
      console.log("Fetched ID:", id); 
    // Single product
     axios.get(`http://localhost:5000/api/products/${id}`)
  
      .then(res => setProducts([res.data]))
      .catch(err => {
        console.error(err);
        iziToast.error({ title: 'Error', message: 'Failed to load product' });
      });
  }
}, [id, location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderItems = products.map(product => ({
      product: product._id,
      quantity: parseInt(formData.quantity),
    }));

    const totalPrice = products.reduce((sum, p) => sum + p.price * formData.quantity, 0);

    const orderData = {
      orderItems,
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      buyerAddress: formData.buyerAddress,
      totalPrice,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders", orderData);


      iziToast.success({ title: 'Success', message: 'Order placed successfully!' });




      navigate('/banner', {
        state: {
          orderId: response.data._id,
          buyerName: response.data.buyerName,
          quantity: formData.quantity,
          totalPrice: response.data.totalPrice,
        },
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Unexpected error occurred';
      iziToast.error({ title: 'Error', message: msg });
    }
  };



  const total = products.reduce((sum, item) => sum + item.price * formData.quantity, 0);

  return (
    <>
    <SiteNavbar/>
    <Container className="my-4" style={{ background: 'linear-gradient(135deg, #f8fafc, #c26ebbff)', padding: '2rem', borderRadius: '12px' }}>
      <h2 className="text-center mb-4">Buy Now</h2>
      <Row>
        {/* <Col md={6}>
          {products.map((product) => (
            <Card key={product._id} className="mb-3">
              <Card.Img
                variant="top"
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ objectFit: 'cover', height: 250 }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>Price:</strong> ₹{product.price}</Card.Text>
                <Card.Text>
                  <strong>Subtotal:</strong> ₹{product.price * formData.quantity}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col> */}

        <Col md={6}>
  {products.length === 1 ? (
    <Card key={products[0]._id} className="mb-3">
      <Card.Img
        variant="top"
        src={`http://localhost:5000${products[0].image}`}
        alt={products[0].name}
        style={{ objectFit: 'cover', height: 250 }}
      />
      <Card.Body>
        <Card.Title>{products[0].name}</Card.Title>
        <Card.Text>{products[0].description}</Card.Text>
        <Card.Text><strong>Price:</strong> ₹{products[0].price}</Card.Text>
        <Card.Text>
          <strong>Subtotal:</strong> ₹{products[0].price * formData.quantity}
        </Card.Text>
      </Card.Body>
    </Card>
  ) : (
    <>
      <h5 className="mb-3">Items in your order:</h5>
      <Row>
        {products.map((product) => (
          <Col xs={6} md={4} lg={4} key={product._id} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ height: 120, objectFit: 'cover' }}
              />
              <Card.Body className="p-2">
                <Card.Title className="fs-6">{product.name}</Card.Title>
                <Card.Text className="mb-1">₹{product.price}</Card.Text>
                <Card.Text className="text-muted small">Subtotal: ₹{product.price * formData.quantity}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )}
</Col>


        <Col md={6}>
          <h4 className="mb-3">Shipping Details</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="buyerAddress"
                rows={3}
                value={formData.buyerAddress}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <h5 className="mb-3 text-end text-success">Total Price: ₹{total}</h5>
            <Button variant="success" type="submit" className="w-100">Place Order</Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );

};

export default BuyNow;
