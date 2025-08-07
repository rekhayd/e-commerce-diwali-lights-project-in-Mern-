

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      iziToast.success({ title: 'Success', message: 'Product added!' });
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
      });
    } catch (err) {
      console.error(err);
      iziToast.error({ title: 'Error', message: 'Failed to add product.' });
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Add Product</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" value={formData.price} onChange={handleChange} type="number" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Dream">Dream</option>
                <option value="HomeLight">HomeLight</option>
                <option value="Office">Office</option>
                <option value="Decor">Decor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control name="stock" value={formData.stock} onChange={handleChange} type="number" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept="image/*" required />
            </Form.Group>

            <Button type="submit">Add Product</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
