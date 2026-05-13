import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Importamos la conexión
import './styles/Home.css';
import { useCart } from './context/CartContext';

function Aceitunas() {
  const [productos, setProductos] = useState([]); // Aquí guardaremos lo que traiga Supabase
  const [cargando, setCargando] = useState(true);
  const { addToCart } = useCart();// Para poner un mensaje de "Cargando..."

  useEffect(() => {
    async function obtenerAceitunas() {
      try {
        const { data, error } = await supabase
          .from('Productos') // Tu tabla se llama Productos
          .select('*')
          .eq('categoria', 'Aceitunas'); // Filtramos para que solo salgan aceitunas

        if (error) throw error;
        setProductos(data);
      } catch (error) {
        console.error("Error cargando aceitunas:", error.message);
      } finally {
        setCargando(false);
      }
    }

    obtenerAceitunas();
  }, []);

  if (cargando) {
    return <div className="text-center py-5">Cargando las mejores aceitunas...</div>;
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">Nuestras Aceitunas</h1>
        <p className="lead text-muted">Directamente desde Supabase a tu mesa.</p>
        <hr className="w-25 mx-auto border-success border-2" />
      </div>

      <div className="row g-4">
        {productos.length > 0 ? (
          productos.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
              <div className="card product-card h-100 shadow-sm border-0">
                <img
                  src={item.imagen_url} // <--- Usamos el nombre de columna de Supabase
                  className="card-img-top"
                  alt={item.nombre}
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fw-bold">{item.nombre}</h5>
                  {/* Si tienes subcategoría (ej: "Sin hueso"), la mostramos */}
                  {item.subcategoria && <small className="text-muted">{item.subcategoria}</small>}

                  <p className="card-text text-success fs-5 fw-semibold">{item.precio}€</p>

                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={() => addToCart(item)} // <--- ¡Ahora sí guarda el producto!
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay aceitunas disponibles todavía.</p>
        )}
      </div>
    </div>
  );
}

export default Aceitunas;