
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Sales = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products'); // all products
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const toggleSale = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/sales/toggle/${id}`);
      toast.success(res.data.message);
      fetchProducts();
    } catch (err) {
      toast.error('Error updating sale status');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Sales Manager</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>On Sale</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.onSale ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  variant={product.onSale ? 'danger' : 'success'}
                  onClick={() => toggleSale(product._id)}
                >
                  {product.onSale ? 'Remove from Sale' : 'Add to Sale'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Sales;
