import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para añadir al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // ¿Ya está el producto en el carrito?
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        // Si existe, le sumamos 1 a la cantidad
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si es nuevo, lo añadimos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Función para contar cuántos productos hay en total
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);