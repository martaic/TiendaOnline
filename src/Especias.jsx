import React, { useCallback, useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// ================= TARJETA DE PRODUCTO =================
function TarjetaEspecia({ item, onVerInfo, onAdd }) {
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


          {/* Enlace discreto: los ingredientes y alérgenos se ven en la ficha */}
          <button
            type="button"
            className="btn btn-link text-muted small mb-3 p-0 text-decoration-none"
            onClick={() => onVerInfo(item)}
          >
            <i className="bi bi-info-circle me-1" aria-hidden="true"></i>Ingredientes
          </button>

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
          </p>

          <button
            type="button"
            className="btn btn-success w-100"
            onClick={handleAdd}
            disabled={agotado}
          >
            {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= VENTANA EMERGENTE (MODAL) =================
function ModalProducto({ producto, onClose }) {
  // Cerrar con la tecla Escape y bloquear el scroll de fondo mientras está abierto
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onClose]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-producto-titulo"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
      onClick={onClose} // Cierra al pulsar fuera
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-success text-white">
            <h2 id="modal-producto-titulo" className="modal-title fw-bold fs-5">
              {producto.nombre}
            </h2>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onClose}
              autoFocus
            ></button>
          </div>

          <div className="modal-body text-center p-4">
            {producto.imagen_url && (
              <img
                src={producto.imagen_url}
                alt={producto.imagen_alt || producto.nombre}
                className="img-fluid rounded mb-3 shadow-sm"
                style={{ maxHeight: '240px', width: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Si el producto no tiene descripción en Shopify (p. ej. el coco), no se muestra este apartado */}
            {producto.descripcion && (
              <div className="text-start mt-3">
                <h3 className="fw-bold text-success fs-6">Ingredientes y alérgenos:</h3>
                <p
                  className="text-muted bg-light p-3 rounded"
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                >
                  {producto.descripcion}
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 p-3">
            <button
              type="button"
              className="btn btn-secondary w-100 py-2 fw-bold"
              onClick={onClose}
            >
              Cerrar y seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= PÁGINA =================
function Especias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [intento, setIntento] = useState(0); // para el botón "Reintentar"

  const { addToCart } = useCart();

  // Título de la pestaña del navegador (también ayuda en Google)
  useEffect(() => {
    document.title = 'Especias | El Puesto de la Dieta';
  }, []);

  useEffect(() => {
    let cancelado = false;

    getCollectionProducts('especias')
      .then((productosShopify) => {
        if (cancelado) return;
        setProductos(productosShopify);
        setError(false);
      })
      .catch((err) => {
        console.error('Error cargando especias:', err);
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
          <p className="text-muted">Cargando especias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Nuestras Especias
        </h1>
        <p className="lead text-muted">
          Esencias naturales para sazonar la vida y disfrutar sorbo a sorbo.
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
          Ahora mismo no hay especias disponibles. ¡Vuelve pronto!
        </p>
      ) : (
        <div className="row g-4">
          {productos.map((item) => (
            <TarjetaEspecia
              key={item.id}
              item={item}
              onVerInfo={setProductoSeleccionado}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalProducto producto={productoSeleccionado} onClose={cerrarModal} />
      )}
    </div>
  );
}

export default Especias;