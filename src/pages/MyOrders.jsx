
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner } from 'react-bootstrap';
import SiteNavbar from '../components/SiteNavbar';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
    <SiteNavbar/>
    <Container className="mt-4"  style={{ background: 'linear-gradient(135deg, #f8fafc, #9e4f90ff)',}}>
      <h3>Your Orders</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Price</th>
            <th>Ordered At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={order._id}>
              <td>{i + 1}</td>
              <td>{order.productName}</td>
              <td>₹{order.price}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </>
  );
};

export default MyOrders;
