


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";
// import "../styles/productList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const data = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">All Products</h2>

      <Form.Control
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            {currentProducts.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Link to={`/product/${product._id}`}>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="product-img"
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>₹{product.price}</Card.Text>
                    <Button
                      variant="outline-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="pagination-controls text-center mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "primary" : "light"}
                onClick={() => setCurrentPage(i + 1)}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default ProductList;
