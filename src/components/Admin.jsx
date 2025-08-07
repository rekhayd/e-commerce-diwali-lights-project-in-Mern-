

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import lighLogo from '../assets/ligh.jpeg';

import {
  Navbar,
  Container,
  Nav,
  Row,
  Col,
  Card,
  Offcanvas,
  Button,
} from 'react-bootstrap';

import {
  BsGear,
  BsHouseDoor,
  BsPeople,
  BsBarChart,
  BsList,
  BsBoxSeam,
  BsCartCheck,
  BsCurrencyDollar,
  BsTags,
  BsChatDots,
} from 'react-icons/bs';

import 'bootstrap/dist/css/bootstrap.min.css';
// import { link } from 'fs';

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-data', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { usersCount, ordersCount, totalRevenue } = res.data;

        setCards([
          {
            title: 'Users',
            value: usersCount,
            icon: <BsPeople size={30} />,
            color: '#007bff',
            info: '+12% this month',
          },
          {
            title: 'Revenue',
            value: `₹${totalRevenue}`,
            icon: <BsCurrencyDollar size={30} />,
            color: '#28a745',
            info: '+8.5% from last week',
          },
          {
            title: 'Orders',
            value: ordersCount,
            icon: <BsCartCheck size={30} />,
            color: '#ffc107',
            info: 'Stable',
          },
          // {
          //   title: 'Total Product',
          //   value: '85',
          //    icon: < FxBoxOpen size={30} />,
          //   color: '#dc3545',
          //   info: ' All data',
            
          // },
        ]);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const chunkedCards = [];
  for (let i = 0; i < cards.length; i += 2) {
    chunkedCards.push(cards.slice(i, i + 2));
  }

  const handleNavClick = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="light" className="shadow-sm px-3 w-100">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-secondary"
              className="d-md-none"
              onClick={() => setShowSidebar(true)}
            >
              <BsList />
            </Button>
            <img
              src={lighLogo}
              alt="Logo"
              width="50"
              style={{ borderRadius: '50%', border: '4px solid #FFD700' }}
            />
          </div>
          <BsGear
            size={24}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/profile')}
          />
        </Container>
      </Navbar>

      {/* Layout */}
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col
            md={3}
            lg={2}
            className="bg-dark text-white p-3 d-none d-md-block"
            style={{ minHeight: '423px' }}
          >
            <h5 className="text-white mb-4 text-center">Admin Panel</h5>
            <Nav className="flex-column gap-2">
              <Nav.Link onClick={() => handleNavClick('/dashboard')} className="text-white">
                <BsHouseDoor className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => handleNavClick('/user')} className="text-white">
                <BsPeople className="me-2" /> Users
              </Nav.Link>
              <Nav.Link onClick={() => handleNavClick('/admin/categories')} className="text-white">
                <BsTags className="me-2" /> Category
              </Nav.Link>
              <Nav.Link onClick={() => handleNavClick('/admin/inventory')} className="text-white">
                <BsBoxSeam className="me-2" /> Inventory
              </Nav.Link>
              <Nav.Link onClick={() => handleNavClick('/admin/orders')} className="text-white">
                <BsCartCheck className="me-2" /> Orders
              </Nav.Link>
              <Nav.Link onClick={() => handleNavClick('/reports')} className="text-white">
                <BsBarChart className="me-2" /> Reports
              </Nav.Link>
            </Nav>
          </Col>

          {/* Offcanvas for Mobile */}
          <Offcanvas
            show={showSidebar}
            onHide={() => setShowSidebar(false)}
            placement="start"
            className="bg-dark text-white"
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title>Admin Panel</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column gap-2">
                <Nav.Link onClick={() => handleNavClick('/dashboard')} className="text-white">
                  <BsHouseDoor className="me-2" /> Dashboard
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick('/user')} className="text-white">
                  <BsPeople className="me-2" /> Users
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick('/admin/categories')} className="text-white">
                  <BsTags className="me-2" /> Category
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick('/admin/inventory')} className="text-white">
                  <BsBoxSeam className="me-2" /> Inventory
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick('/admin/orders')} className="text-white">
                  <BsCartCheck className="me-2" /> Orders
                </Nav.Link>
                <Nav.Link onClick={() => handleNavClick('/reports')} className="text-white">
                  <BsBarChart className="me-2" /> Reports
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Content */}
          <Col md={9} lg={10} className="p-4 bg-light mt-3">
            {chunkedCards.map((rowCards, rowIndex) => (
              <Row key={rowIndex} className="mb-4">
                {rowCards.map((card, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <Card className="shadow-sm text-white h-100" style={{ background: card.color }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Card.Title className="fw-bold">{card.title}</Card.Title>
                            <Card.Text className="fs-4 fw-semibold">{card.value}</Card.Text>
                            <small className="d-block">{card.info}</small>
                          </div>
                          <div className="fs-2">{card.icon}</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ))}
          </Col>
        </Row>
      </Container>

      <footer
        className="text-center text-dark py-3 shadow-sm mt-auto w-100"
        style={{ backgroundColor: '#fff8dc' }}
      >
        © {new Date().getFullYear()} Diwali Lights. All rights reserved.
      </footer>
    </div>
  );
};

export default Admin;
