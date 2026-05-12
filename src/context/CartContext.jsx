import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Función para añadir al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 2. Función para eliminar un producto (la papelera)
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // 3. Función para actualizar cantidades (+ / -)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Evita que la cantidad sea 0 o negativa
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 4. Función para vaciar el carrito (después de pagar)
  const clearCart = () => setCart([]);

  // 5. Cálculos (Contador y Total en Euros)
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Intentamos leer 'price', si no existe, leemos 'precio'
  const cartTotal = cart.reduce((acc, item) => {
    const precioUnitario = item.price !== undefined ? item.price : item.precio;
    return acc + (Number(precioUnitario || 0) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);