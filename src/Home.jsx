import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// Tarjeta de producto reutilizable para Destacados y Novedades
function TarjetaProducto({ item, variante = 'destacado', onAdd }) {
  const [anadido, setAnadido] = useState(false);

  // Usamos la primera VARIANTE: es lo que Shopify necesita para el pago
  const varianteShopify = item.variantes?.[0];
  if (!varianteShopify) return null;

  const precio = Number(varianteShopify.price?.amount || 0);

  const agotado = varianteShopify.availableForSale === false;
  const esNovedad = variante === 'novedad';

  const handleAdd = () => {
    onAdd({
      id: varianteShopify.id, // ID de la variante (gid://shopify/ProductVariant/...)
      title:
        item.variantes.length > 1
          ? `${item.nombre} (${varianteShopify.title})`
          : item.nombre,
      price: precio,
      image: item.imagen_url,
    });
    setAnadido(true);
    setTimeout(() => setAnadido(false), 1500);
  };

  return (
    <div
      className={`card product-card flex-shrink-0 ${esNovedad ? 'border-warning' : ''}`}
      style={{ width: '250px' }}
    >
      {item.imagen_url ? (
        <img
          src={item.imagen_url}
          className="card-img-top"
          alt={item.imagen_alt || item.nombre}
          loading="lazy"
          width="250"
          height="180"
          style={{ height: '180px', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted"
          style={{ height: '180px' }}
        >
          <i className="bi bi-image fs-1"></i>
        </div>
      )}

      <div className="card-body d-flex flex-column text-center">
        <h3 className="card-title fs-6 fw-bold">{item.nombre}</h3>

        <p className="card-text fw-bold text-success">
          {formatearPrecio(precio)}
        </p>

        <button
          className={`btn w-100 mt-auto ${esNovedad ? 'btn-outline-danger' : 'btn-success'}`}
          onClick={handleAdd}
          disabled={agotado}
        >
          {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [destacados, setDestacados] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function cargarHome() {
      // allSettled: si una colección falla, la otra se muestra igualmente
      const [resDestacados, resNovedades] = await Promise.allSettled([
        getCollectionProducts('destacados'),
        getCollectionProducts('novedades'),
      ]);

      if (resDestacados.status === 'fulfilled') {
        setDestacados(resDestacados.value || []);
      } else {
        console.error('Error al cargar Destacados:', resDestacados.reason);
      }

      if (resNovedades.status === 'fulfilled') {
        setNovedades(resNovedades.value || []);
      } else {
        console.error('Error al cargar Novedades:', resNovedades.reason);
      }

      setLoading(false);
    }
    cargarHome();
  }, []);

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
      {/* Título principal para Google y lectores de pantalla (no se ve) */}
      <h1 className="visually-hidden">
        El Puesto de la Dieta: encurtidos, gildas, especias, dulces y frutos secos
      </h1>

      {/* 1. Pestañas de categorías */}
      <nav className="pestañas py-2 bg-light shadow-sm" aria-label="Categorías">
        <ul className="nav justify-content-center">
          <li className="nav-item"><Link className="nav-link text-success fw-bold" to="/aceitunas">Encurtidos</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/gildas">Gildas</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/especias">Especias</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/dulces">Dulces</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/golosinas">Frutos Secos</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/fritos">Fritos</Link></li>
        </ul>
      </nav>

      {/* 2. Productos destacados (colección "destacados" de Shopify) */}
      {destacados.length > 0 && (
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Productos destacados</h2>
          </div>

          <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
            {destacados.map((item) => (
              <TarjetaProducto key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Novedades (colección "novedades" de Shopify) */}
      {novedades.length > 0 && (
        <section className="container py-5 bg-light rounded-4">
          <div className="d-flex justify-content-between align-items-center mb-4 px-3">
            <h2 className="section-title mb-0 text-danger">Novedades</h2>
          </div>

          <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
            {novedades.map((item) => (
              <TarjetaProducto key={item.id} item={item} variante="novedad" onAdd={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* Si Shopify no devuelve nada, avisamos en lugar de dejar la página vacía */}
      {destacados.length === 0 && novedades.length === 0 && (
        <div className="container py-5 text-center text-muted">
          <p className="mb-3">Estamos preparando el puesto. Echa un vistazo a nuestras categorías:</p>
          <Link to="/aceitunas" className="btn btn-success rounded-pill px-4">Ver productos</Link>
        </div>
      )}
    </div>
  );
}

export default Home;