

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: null });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products); // Adjust depending on API structure
    } catch (err) {
      console.error(err);
      iziToast.error({ title: 'Error', message: 'Failed to load products' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, data);
        iziToast.success({ title: 'Updated', message: 'Product updated successfully' });
      } else {
        await axios.post('http://localhost:5000/api/products', data);
        iziToast.success({ title: 'Added', message: 'Product added successfully' });
      }
      setFormData({ name: '', description: '', price: '', image: null });
      setEditId(null);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      iziToast.error({ title: 'Error', message: 'Failed to save product' });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
    });
    setEditId(product._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      iziToast.success({ title: 'Deleted', message: 'Product deleted successfully' });
      fetchProducts();
    } catch (err) {
      console.error(err);
      iziToast.error({ title: 'Error', message: 'Failed to delete product' });
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Manager</h2>
      <Button onClick={() => setShowModal(true)} className="mb-3">Add Product</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentProducts) && currentProducts.map((product, index) => (
            <tr key={product._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>₹{product.price}</td>
              <td>
                {product.image && (
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt="Product"
                    style={{ width: '80px', height: '50px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleEdit(product)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="me-2"
        >
          Previous
        </Button>
        <Button
          variant="outline-primary"
          disabled={indexOfLastItem >= products.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Update Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Choose Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              setFormData({ name: '', description: '', price: '', image: null });
              setEditId(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editId ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
