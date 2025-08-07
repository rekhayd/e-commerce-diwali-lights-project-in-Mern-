



import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the CartContext
const CartContext = createContext();

// Export the custom hook to use the context
export const useCart = () => useContext(CartContext);

// CartProvider to wrap around App
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading cartItems:', err);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading wishlist:', err);
      return [];
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to Cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // Increase quantity
  const incrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Add to Wishlist
  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);
    if (!exists) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  // Move item from Wishlist to Cart
  const moveToCart = (product) => {
    removeFromWishlist(product._id);
    addToCart(product);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};