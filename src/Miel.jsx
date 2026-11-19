import React, { useCallback, useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import ModalProducto from './components/ModalProducto';
import { getCollectionProducts } from './shopifyClient';
import useSeo from './hooks/useSeo';
import { seoDe } from './datosSeo';
import { precioPorKilo } from './utils/precioKilo';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// ================= TARJETA DE PRODUCTO =================
function TarjetaMiel({ item, onVerInfo, onAdd }) {
  const variantes = item.variantes || [];

  // Por defecto elegimos la primera variante que tenga stock
  const [varianteId, setVarianteId] = useState(
    () => (variantes.find((v) => v.availableForSale !== false) || variantes[0])?.id
  );
  const [anadido, setAnadido] = useState(false);

  const varianteActual = variantes.find((v) => v.id === varianteId) || variantes[0];
  if (!varianteActual) return null;

  const agotado = varianteActual.availableForSale === false;
  const tieneVariasOpciones = variantes.length > 1;
  // Si solo hay una opción (p. ej. "250 gr"), la mostramos junto al precio.
  // "Default Title" es lo que pone Shopify cuando el producto no tiene opciones.
  const cantidad =
    !tieneVariasOpciones && varianteActual.title !== 'Default Title' ? varianteActual.title : null;

  const handleAdd = () => {
    onAdd({
      id: varianteActual.id, // ID de la variante: es lo que Shopify necesita para el pago
      title:
        tieneVariasOpciones || cantidad
          ? `${item.nombre} (${varianteActual.title})`
          : item.nombre,
      price: Number(varianteActual.price?.amount || 0),
      image: item.imagen_url,
    });
    setAnadido(true);
    setTimeout(() => setAnadido(false), 1500);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0 product-card">
        {/* La foto abre la ficha con ingredientes y alérgenos */}
        <button
          type="button"
          className="p-0 border-0 bg-transparent"
          onClick={() => onVerInfo(item)}
          aria-label={`Ver ingredientes de ${item.nombre}`}
        >
          {item.imagen_url ? (
            <img
              src={item.imagen_url}
              alt={item.imagen_alt || item.nombre}
              className="card-img-top"
              loading="lazy"
              width="400"
              height="220"
              style={{ height: '220px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted"
              style={{ height: '220px' }}
            >
              <i className="bi bi-image fs-1"></i>
            </div>
          )}
        </button>

        <div className="card-body d-flex flex-column text-center">
          <h2 className="card-title fw-bold fs-5">{item.nombre}</h2>


          {/* Enlace a ingredientes: solo si el producto tiene descripción en Shopify */}
          {item.descripcion && (
            <button
              type="button"
              className="btn btn-link text-muted small mb-3 p-0 text-decoration-none"
              onClick={() => onVerInfo(item)}
            >
              <i className="bi bi-info-circle me-1" aria-hidden="true"></i>Ingredientes
            </button>
          )}

          {tieneVariasOpciones && (
            <div className="mb-3">
              <label className="form-label small fw-bold" htmlFor={`variante-${item.id}`}>
                Selecciona cantidad
              </label>
              <select
                id={`variante-${item.id}`}
                className="form-select"
                value={varianteActual.id}
                onChange={(e) => setVarianteId(e.target.value)}
              >
                {variantes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                    {v.availableForSale === false ? ' (agotado)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="fs-4 fw-bold text-success mt-auto mb-3">
            {formatearPrecio(varianteActual.price?.amount)}
            {cantidad && <span className="fs-6 fw-normal text-muted"> · {cantidad}</span>}
            <span className="d-block fw-normal text-muted" style={{ fontSize: '0.8125rem' }}>
              IVA incluido
              {precioPorKilo(varianteActual.price?.amount, varianteActual.title, item.nombre) &&
                ` · ${precioPorKilo(varianteActual.price?.amount, varianteActual.title, item.nombre)}`}
            </span>
          </p>

          <button
            type="button"
            className="btn btn-success w-100"
            onClick={handleAdd}
            aria-label={`Añadir ${item.nombre} al carrito`}
            disabled={agotado}
          >
            {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= PÁGINA =================
function Miel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [intento, setIntento] = useState(0); // para el botón "Reintentar"

  const { addToCart } = useCart();

  // Título y descripción para Google
  useSeo(seoDe('/miel'));

  useEffect(() => {
    let cancelado = false;

    getCollectionProducts('miel')
      .then((productosShopify) => {
        if (cancelado) return;
        setProductos(productosShopify);
        setError(false);
      })
      .catch((err) => {
        console.error('Error cargando miel:', err);
        if (!cancelado) setError(true);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    // Si el usuario sale de la página antes de que responda Shopify, no actualizamos nada
    return () => {
      cancelado = true;
    };
  }, [intento]);

  const cerrarModal = useCallback(() => setProductoSeleccionado(null), []);

  const reintentar = () => {
    setCargando(true);
    setError(false);
    setIntento((n) => n + 1);
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-2" role="status"></div>
          <p className="text-muted">Cargando miel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Nuestra Miel
        </h1>
        <p className="lead text-muted">
          Miel de siempre, con todo su sabor
        </p>
        <hr className="w-25 mx-auto border-success border-2" />
      </div>

      {error ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">
            No hemos podido cargar los productos. Comprueba tu conexión e inténtalo de nuevo.
          </p>
          <button type="button" className="btn btn-success rounded-pill px-4" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : productos.length === 0 ? (
        <p className="text-center text-muted py-5">
          Ahora mismo no hay miel disponible. ¡Vuelve pronto!
        </p>
      ) : (
        <div className="row g-4">
          {productos.map((item) => (
            <TarjetaMiel
              key={item.id}
              item={item}
              onVerInfo={setProductoSeleccionado}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
          onAdd={addToCart}
        />
      )}
    </div>
  );
}

export default Miel;