
import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import Admin from './Dashboard';
// import Header from '../components/Header';

const User = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      setShowConfirm(false);
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Update user
  const handleEditSave = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });
      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
   {/* <Header /> */}
    <Container className="mt-5"  style={{   background: 'linear-gradient(135deg, #f8fafc, #2f507a)',}}>
    {/* <Container fluid className='pt-4' style={{merginTop:'-32 rem'}}> */}

      <h2 className="mb-3">Registered Users</h2>

      <div className="d-flex justify-content-between mb-3">
        <CSVLink data={users} filename="users.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, idx) => (
            <tr key={user._id}>
              <td>{indexOfFirst + idx + 1}</td>
              <td>
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.avatar}`}
                    alt="avatar"
                    width="40"
                    height="40"
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  'No Avatar'
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditUser({ ...user });
                    setShowEdit(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowConfirm(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName" className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser?.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="editEmail" className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser?.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="editRole" className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editUser?.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{selectedUser?.name}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </>
  );
};

export default User;
