import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; 
import './styles/Home.css'; 
import { useCart } from './context/CartContext';

function Encurtidos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getProductos();
  }, []);

  async function getProductos() {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from('Productos') 
        .select('*')
        .eq('categoria', 'Encurtidos'); // <--- CAMBIA 'Categoria' POR 'categoria' (minúscula)

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  }
 return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Nuestros Encurtidos</h1>
      <div className="row g-4">
        {productos.length > 0 ? (
          productos.map((item) => (
            <div key={item.id} className="col-12 col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <img 
                  src={item.imagen_url} 
                  className="card-img-top" 
                  alt={item.nombre} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="fw-bold">{item.nombre}</h5>
                  <p className="text-muted small flex-grow-1">{item.descripcion}</p>
                  <p className="text-success fw-bold fs-4">{item.precio}€</p>
                  
                  {/* BOTÓN DE AÑADIR AL CARRITO */}
                  <button 
                    className="btn btn-success w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => addToCart(item)}
                  >
                    <i className="bi bi-cart-plus"></i> Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay encurtidos en la base de datos.</p>
        )}
      </div>
    </div>
  );
}

export default Encurtidos;