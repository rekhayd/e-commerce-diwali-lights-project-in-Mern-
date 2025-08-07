

import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Table, Container, Row, Col } from 'react-bootstrap';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    inStock: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (imageFile) data.append('image', imageFile);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : 'http://localhost:5000/api/products';

    try {
      await fetch(url, {
        method,
        body: data,
      });
      setFormData({ name: '', price: '', description: '', category: '', inStock: true });
      setImageFile(null);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      inStock: product.inStock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h2>Manage Products</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowForm(true)}>+ Add</Button>
        </Col>
      </Row>

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>
                {p.image && (
                  <img
                    src={`http://localhost:5000${p.image}`}
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover' }}
                    alt={p.name}
                  />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.inStock ? 'In Stock' : 'Out of Stock'}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(p)}>
                  Edit
                </Button>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="In Stock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="success" onClick={handleSubmit}>
              {editingId ? 'Update' : 'Add'} Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductManager;
