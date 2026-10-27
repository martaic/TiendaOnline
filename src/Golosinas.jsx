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

// Filtros disponibles (clave interna → texto que ve el cliente)
const FILTROS = [
  { clave: 'todos', texto: 'Todos' },
  { clave: 'frutos-secos', texto: 'Frutos secos' },
  { clave: 'frutas-deshidratadas', texto: 'Frutas deshidratadas' },
];

const ETIQUETAS = {
  'frutos-secos': { texto: 'Fruto seco', clase: 'bg-warning text-dark' },
  'frutas-deshidratadas': { texto: 'Fruta deshidratada', clase: 'bg-success' },
};

// ================= TARJETA DE PRODUCTO =================
function TarjetaFrutoSeco({ item, onVerInfo, onAdd }) {
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
  const etiqueta = ETIQUETAS[item.subcategoria];

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
        {etiqueta && (
          <span
            className={`badge position-absolute m-2 ${etiqueta.clase}`}
            style={{ top: 0, right: 0, zIndex: 1 }}
          >
            {etiqueta.texto}
          </span>
        )}

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

          <p className="fs-4 fw-bold text-danger mt-auto mb-3">
            {formatearPrecio(varianteActual.price?.amount)}
            {cantidad && <span className="fs-6 fw-normal text-muted"> · {cantidad}</span>}
          </p>

          <button
            type="button"
            className="btn btn-outline-danger w-100"
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
          <div className="modal-header bg-danger text-white">
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
                <h3 className="fw-bold text-danger fs-6">Ingredientes y alérgenos:</h3>
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
function FrutosSecos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [intento, setIntento] = useState(0); // para el botón "Reintentar"

  const { addToCart } = useCart();

  // Título de la pestaña del navegador (también ayuda en Google)
  useEffect(() => {
    document.title = 'Frutos secos y frutas deshidratadas | El Puesto de la Dieta';
  }, []);

  useEffect(() => {
    let cancelado = false;

    // Pedimos las dos colecciones a la vez (más rápido que una detrás de otra)
    Promise.allSettled([
      getCollectionProducts('frutos-secos'),
      getCollectionProducts('frutas-deshidratadas'),
    ]).then(([resFrutos, resFrutas]) => {
      if (cancelado) return;

      if (resFrutos.status === 'rejected' && resFrutas.status === 'rejected') {
        console.error('Error cargando frutos secos:', resFrutos.reason, resFrutas.reason);
        setError(true);
        setCargando(false);
        return;
      }

      const frutosSecos = resFrutos.status === 'fulfilled' ? resFrutos.value : [];
      const frutasDeshidratadas = resFrutas.status === 'fulfilled' ? resFrutas.value : [];

      // Si un producto está en las dos colecciones, solo lo mostramos una vez
      const vistos = new Set();
      const productosFinales = [
        ...frutosSecos.map((item) => ({ ...item, subcategoria: 'frutos-secos' })),
        ...frutasDeshidratadas.map((item) => ({ ...item, subcategoria: 'frutas-deshidratadas' })),
      ].filter((item) => {
        if (vistos.has(item.id)) return false;
        vistos.add(item.id);
        return true;
      });

      setProductos(productosFinales);
      setError(false);
      setCargando(false);
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

  const productosFiltrados =
    filtro === 'todos' ? productos : productos.filter((item) => item.subcategoria === filtro);

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-danger mb-2" role="status"></div>
          <p className="text-muted">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: '#8d6e63', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Frutos Secos y Frutas Deshidratadas
        </h1>
        <p className="lead text-muted">
          El clásico que nunca falla. Abre, comparte y que empiece el crujido.
        </p>

        {!error && productos.length > 0 && (
          <div className="btn-group mt-3 shadow-sm" role="group" aria-label="Filtrar productos">
            {FILTROS.map(({ clave, texto }) => (
              <button
                key={clave}
                type="button"
                onClick={() => setFiltro(clave)}
                aria-pressed={filtro === clave}
                className={`btn ${filtro === clave ? 'btn-danger' : 'btn-outline-danger'}`}
              >
                {texto}
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">
            No hemos podido cargar los productos. Comprueba tu conexión e inténtalo de nuevo.
          </p>
          <button type="button" className="btn btn-danger rounded-pill px-4" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-center text-muted py-5">
          {productos.length === 0
            ? 'Ahora mismo no hay productos disponibles. ¡Vuelve pronto!'
            : 'No hay productos en esta categoría por ahora.'}
        </p>
      ) : (
        <div className="row g-4">
          {productosFiltrados.map((item) => (
            <TarjetaFrutoSeco
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

export default FrutosSecos;