import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

// Importes de Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Inicializamos Stripe con tu clave publicable
const stripePromise = loadStripe('pk_test_51TWKY4LKhJX2JezpXQHRhPg5a5cZ70l2UDn2bWA0P3M3fQdDWEL83VL2JDWA4I0FFj66WJ2IcYhrz8pgUAVyRrhw00xS0TwWvE');

function Checkout() {
  const { cartTotal } = useCart();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data } = await supabase.from('perfiles').select('*').eq('id', user.id).single();
      if (data) setPerfil(data);
    };
    if (user) cargarDatos();
  }, [user]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 p-4">
            <h2 className="fw-bold text-center mb-4">Finalizar Compra</h2>
            
            {/* Información de envío */}
            <div className="alert alert-info border-0 shadow-sm mb-4">
              <i className="bi bi-info-circle me-2"></i>
              Se enviará a: <br />
              <strong>{perfil?.nombre}</strong><br />
              {perfil?.calle}, {perfil?.numero}<br />
              {perfil?.ciudad}, {perfil?.cp}
            </div>

            <div className="d-flex justify-content-between h5 fw-bold mb-4 border-bottom pb-2">
              <span>Total a pagar:</span>
              <span className="text-success">{cartTotal.toFixed(2)}€</span>
            </div>

            {/* Envolvemos el formulario con Elements para habilitar Stripe */}
            <Elements stripe={stripePromise}>
              <CheckoutForm perfil={perfil} />
            </Elements>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;