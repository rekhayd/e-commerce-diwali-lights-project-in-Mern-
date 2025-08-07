import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Table, Button, Spinner, Modal, Form, Pagination, Row, Col, Card
} from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [deliverOrderId, setDeliverOrderId] = useState(null);

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', authHeader());
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Access denied. Please login.');
      navigate('/admin/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.id) throw new Error();
      fetchOrders();
    } catch (err) {
      toast.error('Invalid or expired token');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  }, []);

  const getOrderDisplayStatus = (order) => {
    if (order.isDelivered) return 'Delivered';
    return order.status || 'Pending';
  };

 
  const filtered = orders.filter((order) => {
 const status = getOrderDisplayStatus(order);
 const matchesSearch =
 (order.buyerName || 'Guest').toLowerCase().includes(searchTerm.toLowerCase()) ||
 (order.buyerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
 const matchesStatus = statusFilter === 'All' || status === statusFilter;
 return matchesSearch && matchesStatus;
});


  const sorted = [...filtered].sort((a, b) => {
    let valA = sortField === 'total' ? (a.totalPrice || a.total || 0) : new Date(a.createdAt || a.date);
    let valB = sortField === 'total' ? (b.totalPrice || b.total || 0) : new Date(b.createdAt || b.date);
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / ordersPerPage);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDeliver = (id) => {
    setDeliverOrderId(id);
    setShowDeliverModal(true);
  };

  const confirmDeliver = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${deliverOrderId}/deliver`, {}, authHeader());
      toast.success('Marked as delivered');
      fetchOrders();
      setShowDeliverModal(false);
    } catch (err) {
      toast.error('Delivery update failed');
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedOrderId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${selectedOrderId}`, authHeader());
      toast.success('Order deleted');
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrderId));
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleStatusClick = (order) => {
    setSelectedStatusOrder(order);
    setNewStatus(order.status || 'Pending');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${selectedStatusOrder._id}`,
        { status: newStatus },
        authHeader()
      );

      toast.success('Status updated');
      setShowStatusModal(false);
      fetchOrders(); 
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="badge bg-warning text-dark">Pending</span>;
      case 'Shipped': return <span className="badge bg-primary">Shipped</span>;
      case 'Delivered': return <span className="badge bg-success">Delivered</span>;
      case 'Cancelled': return <span className="badge bg-danger">Cancelled</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const totalRevenue = orders.reduce((acc, o) => {
    const price = parseFloat(o.totalPrice || o.total || 0);
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  const deliveredOrders = orders.filter((o) => o.isDelivered).length;

  return (
    <Container className="py-4" style={{   background: 'linear-gradient(135deg, #f8fafc, #2f507a)',}}>
      <h2>📦 Customer Orders</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by name/email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Card className="mb-3 p-3">
        <Row>
          <Col><strong>Total Orders:</strong> {orders.length}</Col>
          <Col><strong>Delivered:</strong> {deliveredOrders}</Col>
          <Col><strong>Total Revenue:</strong> ₹{totalRevenue.toFixed(2)}</Col>
        </Row>
      </Card>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <CSVLink data={orders} filename="orders.csv" className="btn btn-success mb-3">
            ⬇️ Export CSV
          </CSVLink>

         

<Table striped bordered responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>Customer</th>
      <th>Email</th>
      <th>Address</th>
      <th>Items</th>
      <th onClick={() => handleSort('total')} style={{ cursor: 'pointer' }}>Total 💰</th>
      <th>Status</th>
      <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date 📅</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentOrders.map((order, idx) => (
      <tr key={order._id}>
        <td>{indexOfFirst + idx + 1}</td>
        <td>{order.buyerName || 'Guest'}</td>
        <td>{order.buyerEmail || 'N/A'}</td>
        <td>{order.buyerAddress || 'N/A'}</td>
        <td>
          <ul>
            {order.orderItems.map((item, i) => (
              <li key={item._id || i}>
                 {item.name} = {item.quantity} 
              </li>
            ))}
          </ul>
        </td>
        <td>₹{order.totalPrice || order.total}</td>
        <td>{getStatusBadge(getOrderDisplayStatus(order))}</td>
        <td>{new Date(order.createdAt || order.date).toLocaleString()}</td>
        <td>
          <Button variant="info" size="sm" className="me-1" onClick={() => setViewOrder(order)}>View</Button>
          <Button variant="warning" size="sm" className="me-1" onClick={() => handleStatusClick(order)}>Status</Button>
          {!order.isDelivered && (
            <Button variant="success" size="sm" className="me-1" onClick={() => handleDeliver(order._id)}>Deliver</Button>
          )}
          <Button variant="danger" size="sm" onClick={() => handleDeleteClick(order._id)}>Delete</Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>




          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}

      {/* View Modal */}
      <Modal show={!!viewOrder} onHide={() => setViewOrder(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewOrder && (
            <>
              <p><strong>Customer:</strong> {viewOrder.buyerName || 'Guest'}</p>
              <p><strong>Email:</strong> {viewOrder.buyerEmail || 'N/A'}</p>
              <p><strong>Status:</strong> {viewOrder.isDelivered ? 'Delivered' : viewOrder.status || 'Pending'}</p>
              <p><strong>Total:</strong> ₹{viewOrder.totalPrice || viewOrder.total}</p>
              <p><strong>Date:</strong> {new Date(viewOrder.createdAt || viewOrder.date).toLocaleString()}</p>
              <hr />
              <h6>Items:</h6>
              <ul>
                {(viewOrder.orderItems || viewOrder.items || []).map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity || 1} — ₹{item.price || '-'}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Status Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmStatusChange}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Deliver Confirmation Modal */}
      <Modal show={showDeliverModal} onHide={() => setShowDeliverModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mark this order as delivered?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeliverModal(false)}>Cancel</Button>
          <Button variant="success" onClick={confirmDeliver}>Yes, Deliver</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;


