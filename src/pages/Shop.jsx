

import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { BsCartPlusFill, BsEye } from "react-icons/bs";
import { ThemeContext } from "../ThemeContext";
import { useCart } from "../CartContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import axios from "axios";
import "izitoast/dist/css/iziToast.min.css";
import bannerImage from '../assets/img4.jpeg';
import SiteNavbar from "../components/SiteNavbar";

const renderRating = (rating) => (
  <span>
    {'⭐'.repeat(Math.floor(rating))}{rating % 1 >= 0.5 ? '⭐½' : ''}
  </span>
);

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 🔁 Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        iziToast.error({
          title: 'Error',
          message: 'Could not load products.',
          position: 'topRight',
        });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SiteNavbar />
      <div className={`${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div
          className="banner d-flex justify-content-center align-items-center text-center"
          style={{
            height: '300px',
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
          }}
        >
          <h1 className="fw-bold bg-dark bg-opacity-50 px-4 py-2 rounded">
            Welcome to Diwali Lights Shop
          </h1>
        </div>

        <Container className="py-5">
          <h2 className="text-center mb-4">Our Products</h2>
          <Row className="g-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      className={`shadow-sm border-0 h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
                    >
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000${product.image}`}
                        style={{
                          height: '180px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        className="hover-zoom"
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{renderRating(product.rating)}</Card.Text>
                        <h5 className="text-primary">₹{product.price}</h5>

                        <div className="mt-auto d-flex justify-content-between gap-2">
                          <Button
                            variant="success"
                            className="flex-fill text-white fw-semibold"
                            onClick={() => {
                              addToCart(product);
                              iziToast.success({
                                title: 'Added!',
                                message: `${product.name} added to cart`,
                                position: 'topRight',
                                timeout: 2000,
                              });
                            }}
                          >
                            <BsCartPlusFill className="me-1" />
                            Add
                          </Button>

                          <Button
                            variant="primary"
                            className="flex-fill text-white fw-semibold"
                            onClick={() => handleShowModal(product)}
                          >
                            <BsEye className="me-1" />
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))
            ) : (
              <p className="text-center">Loading products...</p>
            )}
          </Row>

          {/* 🔍 Product Modal */}
          {selectedProduct && (
            <Modal show={showModal} onHide={handleCloseModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>{selectedProduct.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={`http://localhost:5000${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="img-fluid mb-3"
                />
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                {/* <p><strong>Rating:</strong> {renderRating(selectedProduct.rating)}</p> */}
                <p><strong>Description:</strong> {selectedProduct.description || "No description available."}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    addToCart(selectedProduct);
                    iziToast.success({
                      title: 'Added',
                      message: `${selectedProduct.name} added to cart`,
                      position: 'topRight',
                      timeout: 2000,
                    });
                    handleCloseModal();
                  }}
                >
                  Add to Cart
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Container>
      </div>
    </>
  );
};

export default Shop;
