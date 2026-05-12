import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './styles/Home.css';
import { useCart } from './context/CartContext';



function Dulces() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // Estado para el botón seleccionado
  const [cargando, setCargando] = useState(true);
   const { addToCart } = useCart();


  useEffect(() => {
    fetchDulces();
  }, []);

  async function fetchDulces() {
    setCargando(true);
    const { data, error } = await supabase
      .from('Productos')
      .select('*')
      .eq('categoria', 'Dulces'); // Traemos todos los dulces de la tabla

    if (error) {
      console.error("Error:", error.message);
    } else {
      setProductos(data);
    }
    setCargando(false);
  }

  // LÓGICA DE FILTRADO:
  // Filtramos el array 'productos' según lo que diga el estado 'filtro'
  const productosFiltrados = productos.filter(item => {
    if (filtro === 'todos') return true;
    return item.subcategoria === filtro; 
  });

  if (cargando) return <div className="text-center py-5">Endulzando la página...</div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-danger">Nuestros Dulces</h1>
        <p className="lead text-muted">Artesanos y deliciosos, para todos los gustos.</p>
        
        {/* BOTONES DE FILTRADO */}
        <div className="btn-group mt-3 shadow-sm" role="group">
          <button 
            onClick={() => setFiltro('todos')} 
            className={`btn ${filtro === 'todos' ? 'btn-danger' : 'btn-outline-danger'}`}>
            Todos
          </button>
          <button 
            onClick={() => setFiltro('Con azucar')} 
            className={`btn ${filtro === 'Con azucar' ? 'btn-danger' : 'btn-outline-danger'}`}>
            Con Azúcar
          </button>
          <button 
            onClick={() => setFiltro('Sin azucar')} 
            className={`btn ${filtro === 'Sin azucar' ? 'btn-danger' : 'btn-outline-danger'}`}>
            Sin Azúcar
          </button>
        </div>
      </div>

      <div className="row g-4">
        {productosFiltrados.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
            <div className="card product-card h-100 shadow-sm border-0">
              {/* Etiqueta flotante de subcategoría */}
              <span className={`badge position-absolute m-2 ${item.subcategoria === 'Sin azucar' ? 'bg-info' : 'bg-warning text-dark'}`} style={{top: 0, right: 0}}>
                {item.subcategoria}
              </span>
              
              <img 
                src={item.imagen_url} 
                className="card-img-top" 
                alt={item.nombre} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fw-bold" style={{fontSize: '1rem'}}>{item.nombre}</h5>
                <p className="card-text text-danger fs-5 fw-semibold">{item.precio}€</p>
                <button className="btn btn-outline-danger w-100 mt-auto rounded-pill" onClick={() => addToCart(item)}>
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dulces;