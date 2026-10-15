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

// ================= CONFIGURACIÓN DEL MIX =================
const PASO_GRAMOS = 100; // de 100 en 100 g
const MAX_POR_GILDA = 500; // máximo de una misma gilda dentro del mix

const esMix = (producto) => producto.nombre.toLowerCase().includes('mix');

// Saca los gramos del nombre de la variante en Shopify: "1 kg" → 1000, "1,5 kg" → 1500, "1500 g" → 1500
function gramosDeVariante(titulo = '') {
  const texto = titulo.toLowerCase().replace(',', '.');
  const numero = parseFloat(texto.match(/\d+(\.\d+)?/)?.[0] || '0');
  if (!numero) return 0;
  return texto.includes('kg') || numero < 10 ? Math.round(numero * 1000) : Math.round(numero);
}

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
      <h3 className="fw-bold text-success fs-6 mt-3">📋 Ingredientes y alérgenos:</h3>
      <p className="text-muted bg-light p-3 rounded" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
        {producto.descripcion || 'No se han especificado los ingredientes de este artículo.'}
      </p>
    </Modal>
  );
}

// ================= CREADOR DEL MIX =================
function ModalMix({ productoMix, gildasDisponibles, onClose, onAdd }) {
  // Tamaños del mix = variantes del producto "Mix" en Shopify (p. ej. "1 kg" y "1,5 kg")
  const tamanos = (productoMix.variantes || [])
    .map((v) => ({ ...v, gramos: gramosDeVariante(v.title) }))
    .filter((v) => v.gramos > 0)
    .sort((a, b) => a.gramos - b.gramos);

  const [tamanoId, setTamanoId] = useState(
    () => (tamanos.find((t) => t.availableForSale !== false) || tamanos[0])?.id
  );
  const [mix, setMix] = useState({}); // { "Gilda clásica": 300, ... }

  const tamano = tamanos.find((t) => t.id === tamanoId);
  const objetivo = tamano?.gramos || 0;
  const totalGramos = Object.values(mix).reduce((acc, g) => acc + g, 0);
  const restante = objetivo - totalGramos;
  const completo = objetivo > 0 && totalGramos === objetivo;
  const agotado = tamano?.availableForSale === false;

  const cambiarTamano = (id) => {
    setTamanoId(id);
    setMix({}); // al cambiar de tamaño empezamos de cero
  };

  const actualizarGilda = (nombre, gramos) => {
    setMix((prev) => ({ ...prev, [nombre]: Number(gramos) }));
  };

  const handleAdd = () => {
    const seleccionadas = Object.entries(mix).filter(([, g]) => g > 0);
    const composicion = seleccionadas.map(([nombre, g]) => `${nombre}: ${g} g`).join(', ');

    onAdd({
      // id único por composición: dos mixes distintos no se mezclan en el carrito
      id: `${tamano.id}#${composicion}`,
      variantId: tamano.id, // la variante real de Shopify que se cobra
      title: `${productoMix.nombre} (${tamano.title})`,
      price: Number(tamano.price?.amount || 0),
      image: productoMix.imagen_url,
      descripcion: composicion, // llega al pedido de Shopify como "Composición"
    });
    onClose();
  };

  // Si en Shopify el mix no tiene variantes con peso, avisamos en lugar de romper la página
  if (tamanos.length === 0) {
    return (
      <Modal titulo="Crea tu mix de gildas" colorCabecera="bg-warning" onClose={onClose}>
        <p className="mb-0">
          Ahora mismo no se puede crear el mix. Escríbenos y te lo preparamos a tu gusto.
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      titulo="Crea tu mix de gildas"
      colorCabecera="bg-warning"
      grande
      onClose={onClose}
      pie={
        <div className="d-flex gap-2 w-100">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success flex-grow-1 fw-bold"
            onClick={handleAdd}
            disabled={!completo || agotado}
          >
            {agotado
              ? 'Este tamaño está agotado'
              : completo
                ? `Añadir mix al carrito · ${formatearPrecio(tamano.price?.amount)}`
                : `Te faltan ${restante} g`}
          </button>
        </div>
      }
    >
      {/* Paso 1: tamaño */}
      <h3 className="fs-6 fw-bold mb-2">1. Elige el tamaño</h3>
      <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Tamaño del mix">
        {tamanos.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === tamanoId}
            className={`btn ${t.id === tamanoId ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => cambiarTamano(t.id)}
          >
            {t.title} · {formatearPrecio(t.price?.amount)}
            {t.availableForSale === false ? ' (agotado)' : ''}
          </button>
        ))}
      </div>

      {/* Paso 2: reparto de gramos */}
      <h3 className="fs-6 fw-bold mb-2">2. Reparte los gramos entre tus gildas favoritas</h3>

      <div className="mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span>
            Llevas <strong>{totalGramos} g</strong> de {objetivo} g
          </span>
          <span className={completo ? 'text-success fw-bold' : 'text-muted'}>
            {completo ? '✓ ¡Mix completo!' : `Faltan ${restante} g`}
          </span>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={totalGramos}
          aria-valuemin="0"
          aria-valuemax={objetivo}
          aria-label="Gramos del mix"
        >
          <div
            className={`progress-bar ${completo ? 'bg-success' : 'bg-warning'}`}
            style={{ width: `${Math.min(100, (totalGramos / objetivo) * 100)}%` }}
          ></div>
        </div>
      </div>

      {gildasDisponibles.map((gilda) => {
        const actual = mix[gilda.nombre] || 0;
        // Solo dejamos elegir cantidades que caben en lo que queda del mix
        const maximo = Math.min(MAX_POR_GILDA, actual + restante);
        const opciones = [];
        for (let g = 0; g <= MAX_POR_GILDA; g += PASO_GRAMOS) opciones.push(g);

        return (
          <div
            key={gilda.id}
            className="d-flex justify-content-between align-items-center gap-3 py-2 border-bottom"
          >
            <label htmlFor={`mix-${gilda.id}`} className="d-flex align-items-center gap-2 mb-0">
              {gilda.imagen_url && (
                <img
                  src={gilda.imagen_url}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <span>{gilda.nombre}</span>
            </label>
            <select
              id={`mix-${gilda.id}`}
              className="form-select w-auto"
              value={actual}
              onChange={(e) => actualizarGilda(gilda.nombre, e.target.value)}
            >
              {opciones.map((g) => (
                <option key={g} value={g} disabled={g > maximo}>
                  {g} g
                </option>
              ))}
            </select>
          </div>
        );
      })}

      {totalGramos > 0 && (
        <button
          type="button"
          className="btn btn-link text-danger small px-0 mt-2"
          onClick={() => setMix({})}
        >
          Empezar de nuevo
        </button>
      )}
    </Modal>
  );
}

// ================= TARJETA DE PRODUCTO =================
function TarjetaGilda({ item, onVerInfo, onAdd, onCrearMix }) {
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

  // Para el mix mostramos el precio más bajo ("desde")
  const precioDesde = Math.min(...variantes.map((v) => Number(v.price?.amount || 0)));

  const handleAdd = () => {
    onAdd({
      id: varianteActual.id,
      title: tieneVariasOpciones ? `${item.nombre} (${varianteActual.title})` : item.nombre,
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
            ¡Hazlo a tu gusto!
          </span>
        )}

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

          {item.descripcion && (
            <p
              className="text-muted small mb-1"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.descripcion}
            </p>
          )}

          <button
            type="button"
            className="btn btn-link text-success small mb-3 p-0"
            onClick={() => onVerInfo(item)}
          >
            Ver ingredientes e información
          </button>

          {mix ? (
            <>
              <p className="fs-4 fw-bold text-success mt-auto mb-3">
                {variantes.length > 1 && <span className="fs-6 fw-normal">desde </span>}
                {formatearPrecio(precioDesde)}
              </p>
              <button type="button" className="btn btn-warning w-100 fw-bold" onClick={onCrearMix}>
                Crear mi mix
              </button>
            </>
          ) : (
            <>
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
              </p>

              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handleAdd}
                disabled={agotado}
              >
                {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
              </button>
            </>
          )}
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
  const [mostrarMix, setMostrarMix] = useState(false);

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
  const cerrarMix = useCallback(() => setMostrarMix(false), []);

  const reintentar = () => {
    setCargando(true);
    setError(false);
    setIntento((n) => n + 1);
  };

  const productoMix = gildas.find(esMix);
  const gildasSueltas = gildas.filter((g) => !esMix(g));

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
              onCrearMix={() => setMostrarMix(true)}
            />
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalIngredientes producto={productoSeleccionado} onClose={cerrarIngredientes} />
      )}

      {mostrarMix && productoMix && (
        <ModalMix
          productoMix={productoMix}
          gildasDisponibles={gildasSueltas}
          onClose={cerrarMix}
          onAdd={addToCart}
        />
      )}
    </div>
  );
}

export default Gildas;