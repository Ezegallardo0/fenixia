import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fenixia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('fenixia_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const addToCart = (producto, cantidad = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.producto.id === producto.id);
      if (existing) {
        const newQty = Math.min(producto.stock, existing.cantidad + cantidad);
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: newQty }
            : item
        );
      } else {
        const initialQty = Math.min(producto.stock, cantidad);
        if (initialQty <= 0) return prev;
        return [...prev, { producto, cantidad: initialQty }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productoId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.producto.id === productoId) {
            const nextQty = item.cantidad + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.producto.stock) return item; // Cannot exceed stock
            return { ...item, cantidad: nextQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productoId) => {
    setCartItems(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItems,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

