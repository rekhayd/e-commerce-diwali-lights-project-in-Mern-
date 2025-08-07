import React, { useState } from 'react';
import {
  Navbar, Container, Button, Offcanvas, Nav, Row, Col
} from 'react-bootstrap';

import {
  BsList, BsGear, BsHouseDoor, BsPeople, BsBoxSeam,
  BsCartCheck, BsCurrencyDollar, BsTags, BsBarChart
} from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import lighLogo from '../assets/ligh.jpeg';

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const navLinks = (
    <Nav className="flex-column gap-2">
      <NavLink to="/Dashboard" className="nav-link text-white d-flex align-items-center">
        <BsHouseDoor className="me-2" /> Dashboard
      </NavLink>
      <NavLink to="/user" className="nav-link text-white d-flex align-items-center">
        <BsPeople className="me-2" /> Users
      </NavLink>
      <NavLink to="/admin/categories" className="nav-link text-white d-flex align-items-center">
        <BsPeople className="me-2" /> Customers
      </NavLink>
      <NavLink to="/admin/inventory" className="nav-link text-white d-flex align-items-center">
        <BsBoxSeam className="me-2" /> Inventory
      </NavLink>
      <NavLink to="/admin/orders" className="nav-link text-white d-flex align-items-center">
        <BsCartCheck className="me-2" /> Orders
      </NavLink>
      {/* <NavLink to="/sales" className="nav-link text-white d-flex align-items-center">
        <BsCurrencyDollar className="me-2" /> Sales
      </NavLink>
      <NavLink to="/tags" className="nav-link text-white d-flex align-items-center">
        <BsTags className="me-2" /> Tags
      </NavLink> */}
       <NavLink to="/reports" className="nav-link text-white d-flex align-items-center">
         <BsBarChart className="me-2" /> Reports 
      </NavLink>
     </Nav> 
   );

  return (
    <>
      {/* Top Header */}
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
              alt="Light Logo"
              width="50"
              style={{
                borderRadius: '50%',
                border: '4px solid #FFD700',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </Container>
      </Navbar>

      {/* Main Layout with Sidebar */}
      <Row className="m-0">
        <Col
          md={3}
          lg={2}
          className="bg-dark text-white p-3 d-none d-md-block"
          style={{ minHeight: '100vh' }}
        >
          <h5 className="text-white mb-4 text-center">Admin Panel</h5>
          {navLinks}
        </Col>
      </Row>

      {/* Offcanvas Sidebar for mobile */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{navLinks}</Offcanvas.Body>
      </Offcanvas>
       <footer className="bg-light text-center text-muted py-3 shadow-sm mt-auto w-100"  >
       
      <Container>
        <small>&copy; {new Date().getFullYear()} Diwali Lights Admin Panel. All rights reserved.</small>
      </Container>
    </footer>
    </>
  );
};

export default Header;
