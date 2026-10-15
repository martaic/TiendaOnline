import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'elpuesto-carrito';
const VARIANT_PREFIX = 'gid://shopify/ProductVariant/';

// Lee el carrito guardado en el navegador (si lo hay)
function cargarCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(guardado)) return [];
    // Descartamos productos antiguos que no tengan un ID de variante válido de Shopify
    return guardado.filter(
      (item) =>
        String(item?.variantId || item?.id || '').startsWith(VARIANT_PREFIX) && item.quantity > 0
    );
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  // El carrito se recupera al recargar la página
  const [cart, setCart] = useState(cargarCarritoGuardado);

  // Cada vez que cambia el carrito, lo guardamos en el navegador
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Navegación privada o almacenamiento lleno: el carrito sigue funcionando, solo no se guarda
    }
  }, [cart]);

  // 1. Añadir al carrito
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

  // 2. Eliminar un producto (la papelera)
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 3. Actualizar cantidades (+ / -)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Evita que la cantidad sea 0 o negativa
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // 4. Vaciar el carrito
  const clearCart = () => setCart([]);

  // 5. Cálculos (contador y total en euros)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((acc, item) => {
    const precioUnitario = item.price !== undefined ? item.price : item.precio;
    return acc + Number(precioUnitario || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);