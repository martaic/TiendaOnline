import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; 
import './styles/Home.css'; 
import { useCart } from './context/CartContext';

function Gildas() {
  const [gildas, setGildas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchGildas();
  }, []);

  async function fetchGildas() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos') // <--- CAMBIADO: Usamos la tabla única "Productos"
        .select('*')
        .eq('categoria', 'Gildas'); // <--- Filtramos por la categoría "Gildas"

      if (error) throw error;
      setGildas(data || []);
    } catch (error) {
      console.error('Error al obtener las gildas:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">Nuestras Gildas</h1>
        <p className="lead text-muted">El aperitivo por excelencia, montado a mano cada día</p>
        <hr className="w-25 mx-auto border-success border-2 opacity-50" />
      </div>

      <div className="row g-4 justify-content-center">
        {gildas.length > 0 ? (
          gildas.map((gilda) => (
            <div className="col-12 col-sm-6 col-lg-4" key={gilda.id}>
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative overflow-hidden">
                  <img 
                    src={gilda.imagen_url} // <--- CAMBIADO: Usamos "imagen_url" como en tu base de datos
                    className="card-img-top" 
                    alt={gilda.nombre} 
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-dark opacity-75 p-2">Artesanal</span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column text-center">
                  <h4 className="card-title fw-bold text-dark">{gilda.nombre}</h4>
                  <p className="card-text text-muted flex-grow-1 px-2">
                    {gilda.descripcion}
                  </p>
                  <div className="mt-3">
                    {/* Añadimos el símbolo € para que quede profesional */}
                    <span className="display-6 fw-bold text-success">{gilda.precio}€</span>
                  </div>
                  <button 
                    className="btn btn-success w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => addToCart(gilda)}
                  >
                    <i className="bi bi-cart-plus"></i> Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="lead text-muted">No hay gildas disponibles en este momento.</p>
          </div>
        )}
      </div>

      <div className="mt-5 p-4 bg-light rounded-4 text-center border border-success border-opacity-10">
        <p className="mb-0 text-muted italic">
          * Todas nuestras gildas se preparan con Aceite de Oliva Virgen Extra.
        </p>
      </div>
    </div>
  );
}

export default Gildas;