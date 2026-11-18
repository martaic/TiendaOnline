import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import ModalProducto from './components/ModalProducto';
import { getCollectionProducts } from './shopifyClient';
import useSeo from './hooks/useSeo';
import { precioPorKilo } from './utils/precioKilo';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// El mix lo preparan en el puesto con todas las gildas; el cliente solo elige el tamaño
// Hay dos mixes, y los dos llevan "mix" en el nombre:
// - Mix normal: lo preparan en el puesto con una selección de gildas (el cliente solo elige el tamaño)
// - Mix "a tu gusto": el cliente elige sus gildas (el nombre tiene que llevar "a tu gusto")
const esMix = (producto) => producto.nombre.toLowerCase().includes('mix');
const esMixAGusto = (producto) => esMix(producto) && producto.nombre.toLowerCase().includes('a tu gusto');

// Cuántas variedades elige el cliente para su mix (para todos los tamaños)
const GILDAS_POR_MIX = 6;

// ================= TARJETA DE PRODUCTO =================
function TarjetaGilda({ item, onVerInfo, onAdd, opcionesMix = [] }) {
  const variantes = item.variantes || [];
  const mix = esMix(item);
  const aGusto = esMixAGusto(item); // solo este mix tiene selector de gildas

  const [varianteId, setVarianteId] = useState(
    () => (variantes.find((v) => v.availableForSale !== false) || variantes[0])?.id
  );
  const [anadido, setAnadido] = useState(false);
  // Gildas elegidas para el mix (solo se usa en la tarjeta del mix)
  const [elegidas, setElegidas] = useState([]);
  // Desplegable de gildas del mix (abierto / cerrado)
  const [listaAbierta, setListaAbierta] = useState(false);
  const selectorRef = useRef(null);

  // Cerrar el desplegable al pulsar fuera de él o con Escape
  useEffect(() => {
    if (!listaAbierta) return undefined;
    const alPulsarFuera = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) setListaAbierta(false);
    };
    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') setListaAbierta(false);
    };
    document.addEventListener('mousedown', alPulsarFuera);
    document.addEventListener('keydown', alPulsarTecla);
    return () => {
      document.removeEventListener('mousedown', alPulsarFuera);
      document.removeEventListener('keydown', alPulsarTecla);
    };
  }, [listaAbierta]);

  const varianteActual = variantes.find((v) => v.id === varianteId) || variantes[0];
  if (!varianteActual) return null;

  const agotado = varianteActual.availableForSale === false;
  const tieneVariasOpciones = variantes.length > 1;
  // Si solo hay una opción (p. ej. "250 gr"), la mostramos junto al precio.
  // "Default Title" es lo que pone Shopify cuando el producto no tiene opciones.
  const cantidad =
    !tieneVariasOpciones && varianteActual.title !== 'Default Title' ? varianteActual.title : null;

  // Si hay menos gildas que GILDAS_POR_MIX en la tienda, se piden todas las que haya
  const necesarias = Math.min(GILDAS_POR_MIX, opcionesMix.length);
  const faltan = aGusto ? necesarias - elegidas.length : 0;

  const alternarGilda = (nombre) => {
    setElegidas((actuales) => {
      if (actuales.includes(nombre)) return actuales.filter((n) => n !== nombre);
      if (actuales.length >= necesarias) return actuales; // ya hay 6: no deja añadir más
      return [...actuales, nombre];
    });
  };

  const handleAdd = () => {
    if (aGusto) {
      if (faltan > 0) return;
      const composicion = [...elegidas].sort((a, b) => a.localeCompare(b, 'es')).join(', ');
      onAdd({
        // El id incluye las gildas elegidas: dos mixes distintos son dos líneas distintas en el carrito
        id: `${varianteActual.id}|${composicion}`,
        variantId: varianteActual.id, // lo que Shopify necesita para cobrar
        title: tieneVariasOpciones ? `${item.nombre} (${varianteActual.title})` : item.nombre,
        price: Number(varianteActual.price?.amount || 0),
        image: item.imagen_url,
        descripcion: composicion, // sale en el carrito y en el pedido de Shopify ("Composición")
      });
      setElegidas([]);
      setAnadido(true);
      setTimeout(() => setAnadido(false), 1500);
      return;
    }

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
      <div
        className={`card h-100 shadow-sm product-card ${mix ? 'border-warning border-2' : 'border-0'}`}
        // El mix a tu gusto deja salir su desplegable por fuera de la tarjeta
        // (y se pone por encima de las demás tarjetas mientras está abierto)
        style={aGusto ? { overflow: 'visible', zIndex: listaAbierta ? 30 : 'auto' } : undefined}
      >
        {mix && (
          <span className="badge bg-warning text-dark position-absolute m-2" style={{ top: 0, right: 0, zIndex: 1 }}>
            {aGusto ? 'Elige tus gildas' : 'Mix de gildas'}
          </span>
        )}

        <button
          type="button"
          className="p-0 border-0 bg-transparent"
          onClick={() => onVerInfo(item)}
          aria-label={aGusto ? `Cómo funciona el ${item.nombre}` : mix ? `Ver qué gildas lleva el ${item.nombre}` : `Ver ingredientes de ${item.nombre}`}
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


          {/* El mix siempre enseña qué lleva; el resto, solo si tiene ingredientes en Shopify */}
          {(mix || item.descripcion) && (
            <button
              type="button"
              className={`btn btn-link small mb-3 p-0 ${mix ? 'text-success' : 'text-muted text-decoration-none'}`}
              onClick={() => onVerInfo(item)}
            >
              {aGusto ? (
                'Cómo funciona el mix'
              ) : mix ? (
                'Ver qué gildas lleva'
              ) : (
                <>
                  <i className="bi bi-info-circle me-1" aria-hidden="true"></i>Ingredientes
                </>
              )}
            </button>
          )}

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

          {/* Selector de gildas del mix: un desplegable para que la tarjeta no se estire */}
          {aGusto && necesarias > 0 && (
            <div className="mb-3 position-relative text-start" ref={selectorRef}>
              <span className="form-label small fw-bold d-block text-center" id={`mix-${item.id}`}>
                Elige {necesarias} gildas para tu mix
              </span>
              <button
                type="button"
                className={`form-select text-start ${faltan === 0 ? 'border-success' : ''}`}
                onClick={() => setListaAbierta((abierta) => !abierta)}
                aria-expanded={listaAbierta}
                aria-labelledby={`mix-${item.id}`}
              >
                {elegidas.length === 0
                  ? 'Selecciona tus gildas'
                  : `${elegidas.length} de ${necesarias} elegidas`}
              </button>

              {listaAbierta && (
                <div
                  className="card shadow position-absolute start-0 end-0 mt-1 p-2"
                  style={{ zIndex: 20, maxHeight: '260px', overflowY: 'auto' }}
                >
                  {opcionesMix.map((nombre) => {
                    const marcada = elegidas.includes(nombre);
                    const bloqueada = !marcada && elegidas.length >= necesarias;
                    const idOpcion = `mix-${item.id}-${nombre}`;
                    return (
                      <div key={nombre} className="form-check py-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={idOpcion}
                          checked={marcada}
                          disabled={bloqueada}
                          onChange={() => alternarGilda(nombre)}
                        />
                        <label
                          className={`form-check-label ${bloqueada ? 'text-muted' : ''}`}
                          htmlFor={idOpcion}
                        >
                          {nombre}
                        </label>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="btn btn-success btn-sm w-100 mt-2"
                    onClick={() => setListaAbierta(false)}
                  >
                    {faltan > 0 ? `Listo (faltan ${faltan})` : 'Listo'}
                  </button>
                </div>
              )}

              {/* Las elegidas, en una línea */}
              {elegidas.length > 0 && (
                <p className="small text-muted mt-1 mb-0 text-truncate" title={elegidas.join(', ')}>
                  {elegidas.join(', ')}
                </p>
              )}
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
            aria-label={faltan > 0 ? undefined : `Añadir ${item.nombre} al carrito`}
            disabled={agotado || faltan > 0}
          >
            {agotado
              ? 'Agotado'
              : anadido
                ? '✓ Añadido'
                : faltan > 0
                  ? `Elige ${faltan} ${faltan === 1 ? 'gilda más' : 'gildas más'}`
                  : 'Añadir al carrito'}
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

  // Título y descripción para Google
  useSeo({
    titulo: 'Gildas y mix de gildas', ruta: '/gildas',
    descripcion:
      'Gildas artesanas y mix de gildas: elige el tamaño o crea tu propio mix con 6 variedades. Envío a toda la península desde El Puesto de la Dieta.',
  });

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

  // Gildas que se pueden elegir para el mix: todas las de la tienda menos el propio mix
  // y las que estén agotadas
  const opcionesMix = gildas
    .filter((g) => !esMix(g) && (g.variantes || []).some((v) => v.availableForSale !== false))
    .map((g) => g.nombre);

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
              opcionesMix={opcionesMix}
            />
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarIngredientes}
          onAdd={addToCart}
          {...(esMixAGusto(productoSeleccionado)
            ? {
                // El mix a tu gusto se compra desde su tarjeta, eligiendo las gildas
                tituloInfo: 'Tu mix de gildas:',
                textoInfo: `Elige ${GILDAS_POR_MIX} de nuestras gildas en la tarjeta del mix y te lo preparamos con ellas, en el tamaño que prefieras.`,
                permitirCompra: false,
                aviso: `Cierra esta ventana y elige tus ${GILDAS_POR_MIX} gildas en la tarjeta del mix.`,
              }
            : esMix(productoSeleccionado)
              ? {
                  tituloInfo: 'Gildas que lleva el mix:',
                  textoInfo: 'Preparamos el mix con una selección de todas nuestras gildas.',
                }
              : {})}
        />
      )}

    </div>
  );
}

export default Gildas;