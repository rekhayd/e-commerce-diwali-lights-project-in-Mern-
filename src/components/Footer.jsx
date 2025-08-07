import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from 'react-icons/bs';
import { ThemeContext } from '../ThemeContext';
import '../App.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { darkMode } = useContext(ThemeContext);

  // const handleSubscribe = (e) => {
  //   e.preventDefault();
  //   if (email) {
  //     alert(`Subscribed with: ${email}`);
  //     setEmail('');
  //   }
  // };
  
const handleSubscribe = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/subscribe', {
      email
    });
    toast.success(res.data.success);
    setEmail("");
  } catch (err) {
    toast.error(err.response?.data?.error || "Subscription failed");
  }
};

  return (
    <footer className={`py-4 mt-auto ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Container>
        <Row className="align-items-center mb-4">
          <Col md={4}>
            <h5>Diwali Lights</h5>
            <p className="mb-0">Festive lights & decor to brighten your celebrations.</p>
          </Col>

          <Col md={4}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/banner" className={`text-decoration-none hover-link ${darkMode ? 'text-light' : 'text-dark'}`}>Home</a></li>
              <li><a href="/shop" className={`text-decoration-none hover-link ${darkMode ? 'text-light' : 'text-dark'}`}>Shop</a></li>
              <li><a href="/cart" className={`text-decoration-none hover-link ${darkMode ? 'text-light' : 'text-dark'}`}>Cart</a></li>
              <li><a href="/contact" className={`text-decoration-none hover-link ${darkMode ? 'text-light' : 'text-dark'}`}>Contact</a></li>
            </ul>
          </Col>

          <Col md={4}>
            <h6>Subscribe to Newsletter</h6>
            <Form onSubmit={handleSubscribe}>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" size="sm" className="subscribe-btn">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <Row className="justify-content-between align-items-center">
          <Col md={6}>
            <div className="d-flex gap-3 fs-5">
              <a href="https://facebook.com" className={`text-decoration-none social-icon ${darkMode ? 'text-light' : 'text-dark'}`}><BsFacebook /></a>
              <a href="https://instagram.com" className={`text-decoration-none social-icon ${darkMode ? 'text-light' : 'text-dark'}`}><BsInstagram /></a>
              <a href="https://twitter.com" className={`text-decoration-none social-icon ${darkMode ? 'text-light' : 'text-dark'}`}><BsTwitter /></a>
              <a href="https://linkedin.com" className={`text-decoration-none social-icon ${darkMode ? 'text-light' : 'text-dark'}`}><BsLinkedin /></a>
            </div>
          </Col>
        </Row>

        <hr className={`my-4 ${darkMode ? 'border-light' : 'border-secondary'}`} />
        <p className="text-center mb-0">
          © {new Date().getFullYear()} Diwali Lights. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
