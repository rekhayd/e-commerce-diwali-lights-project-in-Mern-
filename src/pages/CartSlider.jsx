

import React, { useEffect, useRef } from 'react';
import '../styles/CartSlider.css'; 
import { useCart } from '../CartContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, incrementQty, decrementQty } = useCart();
  const navigate = useNavigate();
  const cartItemsRef = useRef(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleViewCart = () => {
    onClose(); 
    navigate('/cart'); 
  };

  useEffect(() => {
    if (isOpen && cartItemsRef.current) {
      cartItemsRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h4>Your Cart</h4>
        <Button variant="danger" size="sm" onClick={onClose}>X</Button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-items" ref={cartItemsRef}>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={`http://localhost:5000${item.image}`} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <div className="qty-controls">
                  <Button size="sm" onClick={() => decrementQty(item._id)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" onClick={() => incrementQty(item._id)}>+</Button>
                </div>
                <p>₹{item.price * item.quantity}</p>
                <Button variant="danger" size="sm" onClick={() => removeFromCart(item._id)}>Remove</Button>
              </div>
            </div>
          ))}

          <div className="subtotal">Subtotal: ₹{subtotal.toFixed(2)}</div>

          <div className="view-cart-button">
            <Button variant="primary" className="mt-3 w-100" onClick={handleViewCart}>
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;