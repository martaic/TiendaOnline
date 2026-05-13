import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';

function CheckoutForm({ perfil }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estilo para que los campos de Stripe se integren con Bootstrap
  const styleOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#212529',
        '::placeholder': { color: '#adb5bd' },
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Creamos el método de pago con los datos de Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: perfil?.nombre || 'Cliente Anónimo',
      },
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      console.log("Token generado:", paymentMethod.id);
      // Aquí es donde en el futuro llamarías a una función de backend para cobrar
      alert("¡Pago procesado con éxito! Gracias por tu compra.");
      clearCart();
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="fw-bold mb-3">Datos de Pago</h5>
      
      <div className="mb-3">
        <label className="form-label small fw-bold">Número de Tarjeta</label>
        <div className="form-control p-2 shadow-sm"><CardNumberElement options={styleOptions} /></div>
      </div>

      <div className="row">
        <div className="col-7 mb-3">
          <label className="form-label small fw-bold">Expiración</label>
          <div className="form-control p-2 shadow-sm"><CardExpiryElement options={styleOptions} /></div>
        </div>
        <div className="col-5 mb-3">
          <label className="form-label small fw-bold">CVC</label>
          <div className="form-control p-2 shadow-sm"><CardCvcElement options={styleOptions} /></div>
        </div>
      </div>

      <div className="form-check mb-4 mt-2">
        <input className="form-check-input" type="checkbox" id="save" defaultChecked />
        <label className="form-check-label small text-muted" htmlFor="save">
          Guardar tarjeta para futuros pagos
        </label>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="btn btn-success w-100 py-3 fw-bold shadow mt-2"
        style={{ backgroundColor: '#556b2f' }}
      >
        {loading ? 'Procesando...' : 'PAGAR AHORA'}
      </button>
      
      <button 
        type="button" 
        className="btn btn-link w-100 mt-2 text-decoration-none text-muted small"
        onClick={() => navigate('/carrito')}
      >
        ATRÁS
      </button>
    </form>
  );
}

export default CheckoutForm;