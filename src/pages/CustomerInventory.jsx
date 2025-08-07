
import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Form, Badge, Button
} from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const fallbackImg = 'https://via.placeholder.com/300x200?text=No+Image';

const CustomerInventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/inventory');
      if (Array.isArray(res.data)) setProducts(res.data);
      else setProducts([]);
    } catch (error) {
      console.error('Fetch error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'All' || p.category === categoryFilter)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Our Products</h2>

      {/* Search & Filter */}
      <Form className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Search by name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Lights">Lights</option>
              <option value="Decorations">Decorations</option>
              <option value="Electronics">Electronics</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Products */}
      <Row>
        {loading ? (
          <Col>
            <h5 className="text-muted text-center">Loading products...</h5>
          </Col>
        ) : paginatedProducts.length === 0 ? (
          <Col>
            <h5 className="text-muted text-center">No products found</h5>
          </Col>
        ) : (
          paginatedProducts.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card className="shadow-sm border-0 h-100 position-relative">
                {/* Wishlist Icon */}
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 m-2 text-danger"
                  onClick={() => toggleWishlist(product._id)}
                >
                  <FaHeart fill={wishlist.includes(product._id) ? 'red' : 'gray'} />
                </Button>

                {/* Product Image */}
                <div className="overflow-hidden" style={{ height: '200px' }}>
                  <Card.Img
                    variant="top"
                    src={product.image || fallbackImg}
                    onError={(e) => (e.target.src = fallbackImg)}
                    className="img-fluid product-img"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                  />
                </div>

                {/* Card Body */}
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {product.name}
                    <Badge bg="secondary" pill>
                      {product.category}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    ₹{product.price}
                    <br />
                    <span className="text-warning">★ ★ ★ ★ ☆</span>
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="mx-3 align-self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Image Hover Style */}
      <style>{`.product-img:hover { transform: scale(1.1); }`}</style>
    </Container>
  );
};

export default CustomerInventory;
