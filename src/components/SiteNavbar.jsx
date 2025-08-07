




import React, { useContext, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsSun,
  BsMoon,
  BsHouseDoor,
  BsShop,
  BsBoxArrowInRight,
  BsPersonCircle
} from 'react-icons/bs';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../CartContext';

const SiteNavbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const toggleTheme = () => setDarkMode(!darkMode);
  const { cartItems, removeFromCart, incrementQty, decrementQty } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

  const [showCart, setShowCart] = useState(false);

  const handleClose = () => setShowCart(false);
  const handleShow = () => setShowCart(true);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const iconStyle = {
    color: darkMode ? 'white' : 'black',
    marginRight: '5px',
  };

  return (
    <>
      <Navbar
        bg={darkMode ? 'dark' : 'light'}
        variant={darkMode ? 'dark' : 'light'}
        expand="lg"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/banner"
            style={{
              color: darkMode ? 'white' : 'black',
              fontFamily: 'cursive',
              fontSize: '1.5rem',
            }}
          >
            Diwali Lights
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center gap-3">
              <Nav.Link as={Link} to="/banner" style={iconStyle}>
                <BsHouseDoor style={iconStyle} /> Home
              </Nav.Link>

              <Nav.Link as={Link} to="/shop" style={iconStyle}>
                <BsShop style={iconStyle} /> Shop
              </Nav.Link>

              <div
                onClick={handleShow}
                title="View Cart"
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: darkMode ? 'white' : 'black',
                }}
              >
                <FaShoppingCart size={22} />
                {totalQty > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      transform: 'translate(30%, -30%)',
                      background: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '11px',
                    }}
                  >
                    {totalQty}
                  </span>
                )}
              </div>

              {user ? (
                <Nav.Link as={Link} to="/profile" style={iconStyle}>
                  <BsPersonCircle style={iconStyle} /> Profile
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login" style={iconStyle}>
                  <BsBoxArrowInRight style={iconStyle} /> Login
                </Nav.Link>
              )}

             

              <Nav.Link as={Link} to="/wishlist" className="position-relative">
 <FaHeart size={20} color={darkMode ? 'white' : 'black'} />
 {wishlistItems.length > 0 && (
 <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
 {wishlistItems.length}
 </span>
 )}
</Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/*  Offcanvas Cart Sidebar */}
      <Offcanvas show={showCart} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {cartItems.length === 0 ? (
            <p>Your cart is empty. <Link to="/shop" onClick={handleClose}>Shop Now</Link></p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <div style={{ maxWidth: '130px' }}>
                      <h6 className="mb-0 text-truncate">{item.name}</h6>
                      <small>₹{item.price} × {item.quantity}</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => decrementQty(item._id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => incrementQty(item._id)}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}

              <div className="text-end mt-4">
                <h6><strong>Total: ₹{subtotal.toFixed(2)}</strong></h6>
                <Button
                  variant="primary"
                  className="mt-3 w-100"
                  onClick={() => {
                    handleClose();
                    navigate('/cart');
                  }}
                >
                  View Full Cart
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SiteNavbar;

