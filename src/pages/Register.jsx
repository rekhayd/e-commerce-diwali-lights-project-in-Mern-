



import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { ThemeContext } from '../ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsEnvelope,
  BsLock,
  BsPerson,
  BsEye,
  BsEyeSlash,
  BsGoogle,
  BsImage,
  BsPhone,
  BsGeoAlt
} from 'react-icons/bs';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../styles/auth.css';

const Register = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, address } = formData;

    if (!name || !email || !password || !phone || !address) {
      return iziToast.error({
        title: 'Error',
        message: 'All fields are required',
        position: 'topCenter',
      });
    }

    if (!validateEmail(email)) {
      return iziToast.warning({
        title: 'Invalid Email',
        message: 'Enter a valid email address',
        position: 'topCenter',
      });
    }

    if (password.length < 6) {
      return iziToast.warning({
        title: 'Weak Password',
        message: 'Password must be at least 6 characters',
        position: 'topCenter',
      });
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );
      if (avatar) formDataToSend.append('avatar', avatar);

      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        return iziToast.error({
          title: 'Error',
          message: data.message || 'Registration failed',
          position: 'topCenter',
        });
      }

      if (data.token && data._id) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data._id);
        iziToast.success({
          title: 'Success',
          message: 'Registered successfully!',
          position: 'topCenter',
        });
        navigate('/login');
      } else {
        iziToast.error({
          title: 'Error',
          message: 'Token not received',
          position: 'topCenter',
        });
      }
    } catch (err) {
      console.error('Registration Error:', err);
      iziToast.error({
        title: 'Error',
        message: err.message || 'Something went wrong',
        position: 'topCenter',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-wrapper ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
    >
      <Container>
        <Card className={`auth-card ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
          <h3 className="text-center mb-3">Create Account</h3>

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label><BsPerson className="me-2" />Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsEnvelope className="me-2" />Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsLock className="me-2" />Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsPhone className="me-2" />Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsGeoAlt className="me-2" />Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsImage className="me-2" />Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-2"
              variant={darkMode ? 'outline-light' : 'primary'}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>

            <Button variant="outline-danger" className="w-100 mb-2">
              <BsGoogle className="me-2" /> Sign up with Google
            </Button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
