import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Card, Spinner, Button, Row, Col, Image, Modal, Form
} from 'react-bootstrap';
import { BsArrowLeft, BsPencilSquare, BsTrash, BsBoxArrowRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return iziToast.error({ message: 'Unauthorized: No token', position: 'topCenter' });



        const { data } = await axios.get('http://localhost:5000/api/profile', {
 headers: { Authorization: `Bearer ${token}` }
});


        setUser(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Profile fetch failed', error);
        iziToast.error({ message: error.response?.data?.message || 'Failed to load profile', position: 'topCenter' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
   
    const token = localStorage.getItem('userToken');
console.log("TOKEN SENT TO BACKEND:", token);

    if (!formData.name || !formData.phone) {
      return iziToast.warning({ message: 'Name and Phone are required!', position: 'topCenter' });
    }


    try {
  const updateForm = new FormData();
  updateForm.append('name', formData.name);
  updateForm.append('phone', formData.phone);
  updateForm.append('address', formData.address);
  if (avatar) updateForm.append('avatar', avatar);

  const { data } = await axios.put('http://localhost:5000/api/profile/update', updateForm, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });


  console.log('Profile updated:', data);
  iziToast.success({ message: 'Profile updated!', position: 'topCenter' });
  setUser(data.user);
  setShowModal(false);
} catch (error) {
  console.error('Profile update error:', error.response?.data || error.message);
  iziToast.error({
    message: error.response?.data?.message || 'Update failed',
    position: 'topCenter',
  });
}
  }


  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    iziToast.success({ message: 'Logged out successfully', position: 'topCenter' });
     navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-4 shadow-sm">
              <h4 className="text-center mb-3">👤 User Profile</h4>

              {user && (
                <>
                  <div className="text-center mb-4">
                    <Image
                      src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://via.placeholder.com/120x120?text=No+Image'}
                      alt="avatar"
                      roundedCircle
                      width={120}
                      height={120}
                      className="border shadow"
                    />


                  </div>

                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                </>
              )}

              <div className="d-flex justify-content-between mt-4 flex-wrap gap-2">
                {/* <Button variant="outline-secondary" onClick={() => navigate(-1)}> */}
    <Button variant="outline-secondary" onClick={() =>               navigate('/banner')}>

                  <BsArrowLeft className="me-2" /> Back
                </Button>

                <Button variant="primary" onClick={handleEdit}>
                  <BsPencilSquare className="me-2" /> Edit
                </Button>

                {/* <Button variant="outline-danger">
                  <BsTrash className="me-2" /> Delete Account
                </Button> */}

                <Button variant="outline-dark" onClick={handleLogout}>
                  <BsBoxArrowRight className="me-2" /> Logout
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
