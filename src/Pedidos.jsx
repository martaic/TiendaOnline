import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Asegúrate de que la ruta a tu cliente de Supabase sea correcta
import { Link } from 'react-router-dom';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Comprobar si hay un usuario autenticado en Supabase
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchPedidos(user.id);
      } else {
        setLoading(false);
      }
    };

    // 2. Traer los pedidos de la base de datos para este usuario
    const fetchPedidos = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPedidos(data || []);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando tus pedidos...</span>
        </div>
      </div>
    );
  }

  // Si no está logueado
  if (!user) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <i className="bi bi-shield-lock display-1 text-muted"></i>
        <h3 className="mt-4 fw-bold">Inicia sesión para ver tus pedidos</h3>
        <p className="text-secondary">Necesitas acceder a tu cuenta para consultar tu historial de compras.</p>
        <Link to="/login" className="btn btn-success rounded-pill px-4" style={{ backgroundColor: '#556b2f', border: 'none' }}>
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  // Si está logueado pero no tiene compras aún
  if (pedidos.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <i className="bi bi-bag-x display-1 text-muted"></i>
        <h3 className="mt-4 fw-bold">Aún no tienes pedidos</h3>
        <p className="text-secondary">¿Hacemos tu primera compra?</p>
        <Link to="/" className="btn btn-success rounded-pill px-4" style={{ backgroundColor: '#556b2f', border: 'none' }}>
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // Listado de pedidos con diseño limpio
  return (
    <div className="container py-5" style={{ minHeight: '60vh' }}>
      <h2 className="fw-bold mb-4">Mis Pedidos</h2>
      <p className="text-secondary mb-4">Consulta el historial y el detalle de tus compras en El puesto de la dieta.</p>

      <div className="row g-4">
        <div className="col-12">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="card shadow-sm border-0 mb-4 p-4 bg-light">
              <div className="row align-items-center mb-3">
                <div className="col-md-4">
                  <span className="text-muted small">FECHA DEL PEDIDO</span>
                  <p className="fw-bold mb-0">{new Date(pedido.created_at).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="col-md-4">
                  <span className="text-muted small">REFERENCIA</span>
                  <p className="fw-bold mb-0">#{pedido.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="col-md-4 text-md-end">
                  <span className="text-muted small d-block">TOTAL</span>
                  <span className="h5 fw-bold text-success">{Number(pedido.total).toFixed(2)}€</span>
                </div>
              </div>
              <hr />
              
              {/* Desglose de productos dentro del pedido */}
              <div className="row">
                <div className="col-12">
                  <h6 className="fw-bold text-secondary mb-3">Productos comprados:</h6>
                  <ul className="list-unstyled mb-0">
                    {pedido.productos.map((prod, index) => (
                      <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <i className="bi bi-box-seam me-2 text-muted"></i>
                          <span className="fw-bold">{prod.title}</span> 
                          <span className="text-muted"> x {prod.quantity} ud.</span>
                        </div>
                        <span className="text-secondary">{(prod.price * prod.quantity).toFixed(2)}€</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>S
    </div>
  );
}

export default Pedidos;