import React from 'react';
import { useCart } from './context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Carrito() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="mt-4">Tu carrito está vacío</h2>
        <p className="text-secondary">¿A qué esperas para llenarlo de aceitunas?</p>
        <Link to="/" className="btn btn-success rounded-pill px-4" style={{ backgroundColor: '#556b2f' }}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Tu Carrito</h2>
      <div className="row g-4">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={item.id} className="card shadow-sm border-0 mb-3 p-3">
              <div className="row align-items-center">
                <div className="col-5 col-md-5">
                  <h5 className="mb-0 fw-bold">{item.nombre}</h5>
                  <p className="text-secondary mb-0">{item.precio}€ / ud</p>
                </div>
                <div className="col-4 col-md-3">
                  <div className="input-group input-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="input-group-text bg-white px-3">{item.quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                  <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h4 className="fw-bold mb-4">Resumen</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span>Gastos de envío</span>
              <span className="text-success fw-bold">Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="h5 fw-bold">Total</span>
              <span className="h5 fw-bold text-success">{cartTotal.toFixed(2)}€</span>
            </div>
            <button 
              className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow"
              style={{ backgroundColor: '#556b2f' }}
              onClick={() => navigate('/checkout')}
            >
              Confirmar y Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;