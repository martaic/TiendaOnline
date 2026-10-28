import React, { useCallback, useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { useSearchParams } from 'react-router-dom';
import { buscarProductos } from './shopifyClient';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// ================= TARJETA DE PRODUCTO =================
function TarjetaResultado({ item, onVerInfo, onAdd }) {
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
            <span className="d-block fw-normal text-muted" style={{ fontSize: '0.75rem' }}>
              IVA incluido
            </span>
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
function Buscar() {
  // El texto buscado va en la dirección (/buscar?q=aceitunas), así se puede compartir o volver atrás
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get('q') || '';

  const [texto, setTexto] = useState(busqueda);
  // Guardamos para qué búsqueda son los resultados: si no coincide con la actual, está cargando
  const [respuesta, setRespuesta] = useState({ para: '', productos: [], error: false });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    document.title = busqueda
      ? `Buscar "${busqueda}" | El Puesto de la Dieta`
      : 'Buscar | El Puesto de la Dieta';
  }, [busqueda]);

  // Mientras se escribe, esperamos un poco antes de buscar (para no buscar en cada letra)
  useEffect(() => {
    const espera = setTimeout(() => {
      if (texto.trim() !== busqueda) {
        setSearchParams(texto.trim() ? { q: texto.trim() } : {}, { replace: true });
      }
    }, 400);
    return () => clearTimeout(espera);
  }, [texto, busqueda, setSearchParams]);

  // Buscar en Shopify cada vez que cambia la búsqueda
  useEffect(() => {
    if (!busqueda) return undefined;

    let cancelado = false;

    buscarProductos(busqueda)
      .then((productos) => {
        if (!cancelado) setRespuesta({ para: busqueda, productos, error: false });
      })
      .catch((err) => {
        console.error('Error buscando productos:', err);
        if (!cancelado) setRespuesta({ para: busqueda, productos: [], error: true });
      });

    return () => {
      cancelado = true;
    };
  }, [busqueda]);

  const cargando = Boolean(busqueda) && respuesta.para !== busqueda;
  const { productos: resultados, error } = respuesta;

  const cerrarModal = useCallback(() => setProductoSeleccionado(null), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(texto.trim() ? { q: texto.trim() } : {});
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-success" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Buscar productos
        </h1>
      </div>

      {/* Caja de búsqueda */}
      <form onSubmit={handleSubmit} role="search" className="mx-auto mb-5" style={{ maxWidth: '560px' }}>
        <label htmlFor="buscador" className="visually-hidden">
          Buscar productos
        </label>
        <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
          <span className="input-group-text bg-white border-0 ps-4">
            <i className="bi bi-search text-muted" aria-hidden="true"></i>
          </span>
          <input
            id="buscador"
            type="search"
            className="form-control border-0"
            placeholder="Aceitunas, mango, gildas..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>
      </form>

      {!busqueda ? (
        <p className="text-center text-muted">Escribe el nombre de un producto para buscarlo.</p>
      ) : cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success mb-2" role="status"></div>
          <p className="text-muted">Buscando...</p>
        </div>
      ) : error ? (
        <p className="text-center text-muted py-5">
          No hemos podido hacer la búsqueda. Comprueba tu conexión e inténtalo de nuevo.
        </p>
      ) : resultados.length === 0 ? (
        <p className="text-center text-muted py-5">
          No hemos encontrado productos para «{busqueda}». Prueba con otra palabra.
        </p>
      ) : (
        <>
          <p className="text-muted mb-4" aria-live="polite">
            {resultados.length === 1 ? '1 producto encontrado' : `${resultados.length} productos encontrados`}
          </p>
          <div className="row g-4">
            {resultados.map((item) => (
              <TarjetaResultado
                key={item.id}
                item={item}
                onVerInfo={setProductoSeleccionado}
                onAdd={addToCart}
              />
            ))}
          </div>
        </>
      )}

      {productoSeleccionado && (
        <ModalProducto producto={productoSeleccionado} onClose={cerrarModal} />
      )}
    </div>
  );
}

export default Buscar;
