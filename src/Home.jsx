import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext'; // Mantener tu Carrito
import { getCollectionProducts } from './shopifyClient'; // Nueva conexión a Shopify

function Home() {
  const [destacados, setDestacados] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function cargarHome() {
      try {
        // Traemos las dos colecciones de Shopify en paralelo
        const [dataDestacados, dataOfertas] = await Promise.all([
          getCollectionProducts('destacados'),
          getCollectionProducts('novedades')
        ]);

        setDestacados(dataDestacados || []);
        setOfertas(dataOfertas || []);
      } catch (error) {
        console.error("Error al cargar los productos desde Shopify:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarHome();
  }, []);

  // Pantalla de espera sutil mientras Shopify responde
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-2" role="status"></div>
          <p className="text-muted">Cargando el puesto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-home">
      {/* 1. Pestañas de categorías */}
      <div className="pestañas py-2 bg-light shadow-sm">
        <ul className="nav justify-content-center">
          <li className="nav-item"><Link className="nav-link text-success fw-bold" to="/aceitunas">Encurtidos</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/gildas">Gildas</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/especias">Especias</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/dulces">Dulces</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/golosinas">Frutos Secos</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/fritos">Fritos</Link></li>
        </ul>
      </div>

      {/* 2. Sección del Logo Principal (Reemplaza al carrusel) */}
      <div className="d-flex justify-content-center align-items-center bg-light shadow-sm" style={{ height: '400px', overflow: 'hidden' }}>
        <img 
          src="/logo.png" 
          className="img-fluid" 
          alt="El Puesto de la Dieta" 
          style={{ maxHeight: '150%', width: 'auto', objectFit: 'contain' }} 
        />
      </div>

      {/* 3. Sección Productos Destacados DINÁMICA */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">Productos destacados</h1>
        </div>

        <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
          {destacados.map((item) => {
            // Extraemos el precio de la primera variante de Shopify
            const precio = item.variantes[0]?.price?.amount || "0.00";

            return (
              <div className="card product-card flex-shrink-0" style={{ width: '250px' }} key={item.id}>
                <img src={item.imagen_url} className="card-img-top" alt={item.nombre} style={{ height: '180px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fs-6 fw-bold">{item.nombre}</h5>
                  <p className="card-text text-success fw-bold">{precio}€</p>
                  <button 
                    className="btn btn-success w-100 mt-auto"
                    onClick={() => addToCart({ ...item, precio })} // Pasamos el precio mapeado al carrito
                  >
                    Añadir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sección Ofertas DINÁMICA */}
      <div className="container py-5 bg-light rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <h1 className="section-title mb-0 text-danger">Novedades</h1>
        </div>

        <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
          {ofertas.map((item) => {
            // Extraemos y calculamos los precios basados en la variante de Shopify
            const precioNumero = parseFloat(item.variantes[0]?.price?.amount || 0);
            const precio = precioNumero.toFixed(2);
            const precioAnterior = (precioNumero * 1.2).toFixed(2);

            return (
              <div className="card product-card border-warning flex-shrink-0" style={{ width: '250px' }} key={item.id}>
                <img src={item.imagen_url} className="card-img-top" alt={item.nombre} style={{ height: '180px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fs-6 fw-bold">{item.nombre}</h5>
                  <p className="card-text text-muted small text-decoration-line-through">{precioAnterior}€</p>
                  <p className="card-text text-danger fw-bold">{precio}€</p>
                  <button 
                    className="btn btn-outline-danger w-100 mt-auto"
                    onClick={() => addToCart({ ...item, precio })} // Pasamos el precio mapeado al carrito
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;