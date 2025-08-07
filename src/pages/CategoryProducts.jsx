
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import iziToast from 'izitoast';
import SiteNavbar from "../components/SiteNavbar";



const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/by-category/${categoryId}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleBuyNow = (product) => {
    iziToast.success({
      title: 'Redirecting',
      message: `Proceeding to checkout for "${product.name}"`,
      timeout: 1000
    });

    setTimeout(() => {
      navigate(`/buy-now/${product._id}`);
    }, 1000);
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existing = cart.find(item => item._id === product._id);

    if (existing) {
      iziToast.info({
        title: 'Info',
        message: `"${product.name}" is already in the cart.`,
        position: 'topRight'
      });
    } else {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cartItems', JSON.stringify(cart));
      iziToast.success({
        title: 'Added',
        message: `"${product.name}" added to cart.`,
        position: 'topRight'
      });
    }
  };

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
     <>
        <SiteNavbar/>
    <Container className="py-4" style={{ background: 'linear-gradient(135deg, #f8fafc, #bc61baff)' }}>
      <h2 className="mb-4 text-center">🛒 Products in Category</h2>
      <Row>
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map(product => (
            <Col md={4} sm={6} xs={12} key={product._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>₹{product.price}</Card.Text>

                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <Button variant="success" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                    <Button variant="primary" onClick={() => handleBuyNow(product)}>Buy Now</Button>
                    <Button variant="info" onClick={() => handleShowDetails(product)}>Details</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal for product details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <img
                src={`http://localhost:5000${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="img-fluid mb-3"
              />
              <h5>{selectedProduct.name}</h5>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Description:</strong> {selectedProduct.description || 'No description available.'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </>
  );
};

export default CategoryProducts;
