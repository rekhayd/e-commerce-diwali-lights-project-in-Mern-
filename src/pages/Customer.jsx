


import React, { useState, useEffect } from 'react';
import {
  Container, Table, Button, Modal, Row, Col, Pagination, Form
} from 'react-bootstrap';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    _id: '', name: '', email: '', phone: '', address: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/customers?page=${page}&limit=5`);
      const data = await res.json();
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/customers/${customerToDelete._id}`, {
        method: 'DELETE'
      });
      setCustomers(customers.filter(c => c._id !== customerToDelete._id));
      toast.success(`${customerToDelete.name} has been deleted.`);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Delete error:', error);
    }
  };

  const handleEditClick = (customer) => {
    setEditFormData(customer);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${editFormData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        const updatedList = customers.map((c) =>
          c._id === updatedCustomer._id ? updatedCustomer : c
        );
        setCustomers(updatedList);
        toast.success(`${editFormData.name} updated successfully!`);
        setShowEditModal(false);
      } else {
        toast.error('Update failed.');
      }
    } catch (error) {
      toast.error('Error updating customer.');
      console.error('Edit error:', error);
    }
  };

  return (
    <>
      <Header title="Customer Management" />
      <Container fluid className="pt-4">
        <Row>
          {/* <Col lg={10} className="ms-auto mt-5"> */}
          <Col
           md={{ span: 9, offset: 3 }}
            style={{
              height: 'calc(100vh - 70px)',
               overflowY: 'auto',
               paddingRight: '1rem',
              paddingTop: '2rem',
              marginTop: '-36rem',
              marginLeft: '18rem',
             }}
           >
            <h2 className="mb-4">Customer List</h2>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, idx) => (
                    <tr key={customer._id}>
                      <td>{(currentPage - 1) * 5 + idx + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.address}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2" onClick={() => handleView(customer)}>View</Button>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(customer)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(customer)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Pagination */}
            <Pagination>
              <Pagination.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
              <Pagination.Last disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
            </Pagination>
          </Col>
        </Row>
      </Container>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={editFormData.name} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={editFormData.email} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={editFormData.address} onChange={handleEditChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
};

export default Customer;
