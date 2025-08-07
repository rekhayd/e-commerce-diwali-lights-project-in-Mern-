

import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { ThemeContext } from '../ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { BsEnvelope, BsLock } from 'react-icons/bs';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return iziToast.error({
        title: 'Error',
        message: 'Please fill all fields',
        position: 'topCenter',
      });
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return iziToast.error({
          title: 'Error',
          message: data.message || 'Login failed',
          position: 'topCenter',
        });
      }

      if (data.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data._id || '');
        iziToast.success({
          title: 'Success',
          message: 'Login successful!',
          position: 'topCenter',
        });
        navigate('/profile');
      } else {
        iziToast.error({
          title: 'Error',
          message: 'Token not received. Login failed.',
          position: 'topCenter',
        });
      }
    } catch (err) {
      console.error('Login Error:', err);
      iziToast.error({
        title: 'Error',
        message: 'Network error. Please try again.',
        position: 'topCenter',
      });
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div
  //     className={`vh-100 d-flex align-items-center justify-content-center ${
  //       darkMode ? 'bg-dark text-light' : 'bg-light text-dark'
  //     }`}
  //   >
  //     <Container style={{ maxWidth: '400px' }}>
  //       <Card className={`p-4 shadow ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
  //         <h3 className="text-center mb-3">Login</h3>



  return (
  <div
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #2f507a)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Container style={{ maxWidth: '400px' }}>
      <Card
        className={`p-4 shadow ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
      >
        <h3 className="text-center mb-3">Login</h3>
     


          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label><BsEnvelope className="me-2" /> Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><BsLock className="me-2" /> Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              variant={darkMode ? 'outline-light' : 'primary'}
              disabled={loading}
            >
              {loading ? <><Spinner animation="border" size="sm" className="me-2" />Logging in...</> : 'Login'}
            </Button>

            <p className="mt-3 text-center">
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
