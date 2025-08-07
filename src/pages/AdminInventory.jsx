import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Button, Modal, Form, Row, Col, Pagination
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const productData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];
      setProducts(productData);
    } catch (err) {
      toast.error('Failed to fetch products');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product = {}) => {
    setCurrentProduct(product);
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(currentProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (currentProduct._id) {
        await axios.put(
          `http://localhost:5000/api/products/${currentProduct._id}`,
          formData,
          config
        );
        toast.success('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/products', formData, config);
        toast.success('Product added');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error('Save failed');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Delete failed');
        console.error(err);
      }
    }
  };

  const productList = Array.isArray(products) ? products : [];
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const displayedProducts = productList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="py-4" style={{   background: 'linear-gradient(135deg, #f8fafc, #2f507a)',}}>
      <h2>Inventory Management</h2>

      <div className="d-flex justify-content-between align-items-center my-2">
        <CSVLink data={productList} filename="inventory.csv">
          <Button variant="success">Export CSV</Button>
        </CSVLink>

        <Button variant="primary" onClick={() => handleEdit({})}>
          + Add Product
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.map((product, index) => (
            <tr key={product._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>
                {product.image && (
                 
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} height="40" />

                )}
              </td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(product)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} />
      </Pagination>

      {/*  Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct._id ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Name</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Price</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={currentProduct.price || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Category</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={currentProduct.category || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>Stock</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={currentProduct.stock || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="mt-2"
                  height="60"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInventory;

