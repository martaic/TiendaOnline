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

// El mix lo preparan en el puesto con todas las gildas; el cliente solo elige el tamaño
const esMix = (producto) => producto.nombre.toLowerCase().includes('mix');

// ================= VENTANA EMERGENTE BASE =================
function Modal({ titulo, colorCabecera = 'bg-success', grande = false, onClose, children, pie }) {
  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierta
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
      aria-labelledby="modal-titulo"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down ${
          grande ? 'modal-lg' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          <div className={`modal-header text-white ${colorCabecera}`}>
            <h2 id="modal-titulo" className="modal-title fw-bold fs-5">
              {titulo}
            </h2>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onClose}
              autoFocus
            ></button>
          </div>
          <div className="modal-body p-4">{children}</div>
          {pie && <div className="modal-footer border-0 p-3">{pie}</div>}
        </div>
      </div>
    </div>
  );
}

// ================= FICHA DE INGREDIENTES =================
function ModalIngredientes({ producto, onClose }) {
  return (
    <Modal
      titulo={producto.nombre}
      onClose={onClose}
      pie={
        <button type="button" className="btn btn-secondary w-100 py-2 fw-bold" onClick={onClose}>
          Cerrar y seguir comprando
        </button>
      }
    >
      <div className="text-center">
        {producto.imagen_url && (
          <img
            src={producto.imagen_url}
            alt={producto.imagen_alt || producto.nombre}
            className="img-fluid rounded mb-3 shadow-sm"
            style={{ maxHeight: '240px', width: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <h3 className="fw-bold text-success fs-6 mt-3">
        {esMix(producto) ? 'Gildas que lleva el mix:' : 'Ingredientes y alérgenos:'}
      </h3>
      <p className="text-muted bg-light p-3 rounded" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
        {producto.descripcion ||
          (esMix(producto)
            ? 'Preparamos el mix con una selección de todas nuestras gildas.'
            : 'No se han especificado los ingredientes de este artículo.')}
      </p>
    </Modal>
  );
}

// ================= TARJETA DE PRODUCTO =================
function TarjetaGilda({ item, onVerInfo, onAdd }) {
  const variantes = item.variantes || [];
  const mix = esMix(item);

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
      id: varianteActual.id,
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
    <div className="col-12 col-sm-6 col-lg-4">
      <div className={`card h-100 shadow-sm product-card ${mix ? 'border-warning border-2' : 'border-0'}`}>
        {mix && (
          <span className="badge bg-warning text-dark position-absolute m-2" style={{ top: 0, right: 0, zIndex: 1 }}>
            Mix de gildas
          </span>
        )}

        <button
          type="button"
          className="p-0 border-0 bg-transparent"
          onClick={() => onVerInfo(item)}
          aria-label={mix ? `Ver qué gildas lleva el ${item.nombre}` : `Ver ingredientes de ${item.nombre}`}
        >
          {item.imagen_url ? (
            <img
              src={item.imagen_url}
              alt={item.imagen_alt || item.nombre}
              className="card-img-top"
              loading="lazy"
              width="400"
              height="250"
              style={{ height: '250px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted"
              style={{ height: '250px' }}
            >
              <i className="bi bi-image fs-1"></i>
            </div>
          )}
        </button>

        <div className="card-body d-flex flex-column text-center">
          <h2 className="fw-bold fs-4">{item.nombre}</h2>


          <button
            type="button"
            className="btn btn-link text-success small mb-3 p-0"
            onClick={() => onVerInfo(item)}
          >
            {mix ? 'Ver qué gildas lleva' : 'Ver ingredientes e información'}
          </button>

          {tieneVariasOpciones && (
            <div className="mb-3">
              <label className="form-label small fw-bold" htmlFor={`variante-${item.id}`}>
                {mix ? 'Elige el tamaño del mix' : 'Selecciona cantidad'}
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

// ================= PÁGINA =================
function Gildas() {
  const [gildas, setGildas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Gildas y mix de gildas | El Puesto de la Dieta';
  }, []);

  useEffect(() => {
    let cancelado = false;

    getCollectionProducts('gildas')
      .then((productosShopify) => {
        if (cancelado) return;
        setGildas(productosShopify);
        setError(false);
      })
      .catch((err) => {
        console.error('Error cargando gildas:', err);
        if (!cancelado) setError(true);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const cerrarIngredientes = useCallback(() => setProductoSeleccionado(null), []);

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
          <p className="text-muted">Preparando las gildas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Nuestras Gildas
        </h1>
        <p className="lead text-muted">
          La reina del picoteo. Un clásico que siempre te deja con ganas de otra.
        </p>
        <hr className="w-25 mx-auto border-success border-2 opacity-50" />
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
      ) : gildas.length === 0 ? (
        <p className="text-center text-muted py-5">
          Ahora mismo no hay gildas disponibles. ¡Vuelve pronto!
        </p>
      ) : (
        <div className="row g-4 justify-content-center">
          {gildas.map((gilda) => (
            <TarjetaGilda
              key={gilda.id}
              item={gilda}
              onVerInfo={setProductoSeleccionado}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalIngredientes producto={productoSeleccionado} onClose={cerrarIngredientes} />
      )}

    </div>
  );
}

export default Gildas;