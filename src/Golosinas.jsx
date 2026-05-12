import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles/Home.css'; 
import { useCart } from './context/CartContext';

function Golosinas() {
  const [todasLasChuches, setTodasLasChuches] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchChuches();
  }, []);

  async function fetchChuches() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .eq('categoria', 'Golosinas');

      if (error) throw error;
      setTodasLasChuches(data || []);
    } catch (error) {
      console.error('Error cargando chuches:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- LÓGICA DE FILTRADO CORREGIDA ---
  const productosFiltrados = todasLasChuches.filter(item => {
    if (filtro === 'todos') return true;
    // Usamos 'subcategoria1' que es el nombre de tu nueva columna
    return item.subcategoria1 === filtro; 
  });

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-grow text-danger" role="status"></div>
      <p className="mt-2">Endulzando la pantalla...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ color: '#e91e63' }}>Mundo Sweet</h1>
        
        <div className="btn-group mt-3 shadow-sm">
          <button 
            className={`btn ${filtro === 'todos' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          
          <button 
            /* El valor debe coincidir con lo que escribas en Supabase (ej: 'Gominolas') */
            className={`btn ${filtro === 'Gominolas' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFiltro('Gominolas')}
          >
            Gominolas
          </button>

          <button 
            /* IMPORTANTE: En tu captura sale "Fruta deshidratada", así que ponemos eso exacto */
            className={`btn ${filtro === 'Fruta deshidratada' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFiltro('Fruta deshidratada')}
          >
            Fruta Deshidratada
          </button>
        </div>
      </div>

      <div className="row g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((item) => (
            <div className="col-6 col-md-4 col-lg-3" key={item.id}>
              <div className="card h-100 shadow-sm border-0 product-card">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={item.imagen_url} 
                      className="card-img-top w-100 h-100" 
                      style={{ objectFit: 'cover' }}
                      alt={item.nombre} 
                    />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h6 className="card-title fw-bold text-capitalize">{item.nombre}</h6>
                  <p className="card-text text-danger fw-bold mt-auto">{item.precio}€</p>
                  <button className="btn btn-sm btn-outline-danger rounded-pill mt-2" onClick={() => addToCart(item)}>
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No hay productos en "{filtro}" todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Golosinas;