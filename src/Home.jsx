import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { getCollectionProducts, getTopVentas } from './shopifyClient';
import PreguntasFrecuentes from './PreguntasFrecuentes';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// Pestañas de categorías (para añadir o cambiar una, tócala solo aquí)
// "icono" puede ser un dibujo de la carpeta public/iconos/ o un emoji
const CATEGORIAS = [
  { nombre: 'Encurtidos', ruta: '/aceitunas', icono: '/iconos/encurtidos.png' },
  { nombre: 'Gildas', ruta: '/gildas', icono: '/iconos/gildas.png' },
  { nombre: 'Especias', ruta: '/especias', icono: '/iconos/especias.png' },
  { nombre: 'Dulces', ruta: '/dulces', icono: '/iconos/dulces.png' },
  { nombre: 'Frutos secos', ruta: '/golosinas', icono: '🥜' },
  { nombre: 'Fruta deshidratada', ruta: '/fruta-deshidratada', icono: '/iconos/fruta-deshidratada.png' },
  { nombre: 'Fritos', ruta: '/fritos', icono: '/iconos/fritos.png' },
  { nombre: 'Envases', ruta: '/envases', icono: '/iconos/envases.png' },
  { nombre: 'Caramelos', ruta: '/caramelos', icono: '/iconos/caramelos.png' },
  { nombre: 'Miel', ruta: '/miel', icono: '/iconos/miel.png' },
];

// ================= SECCIONES DE LA PORTADA =================
// Para cambiar el orden, los títulos o la colección de Shopify, toca solo esta lista.
// Una sección sin productos no se muestra.
//  - coleccion: nombre de la colección en Shopify (su "handle", el final de la URL)
//  - estilo: 'normal', 'campana' (marco naranja y título rojo) o 'top' (con su número de puesto)
const SECCIONES = [
  { clave: 'campana', titulo: 'Productos de campaña', coleccion: 'novedades', estilo: 'campana' },
  { clave: 'destacados', titulo: 'Productos destacados', coleccion: 'destacados', estilo: 'normal' },
  // Top ventas: usa la colección "top-ventas" si existe; si no, los más vendidos automáticamente
  { clave: 'top', titulo: 'Top ventas', top: true, estilo: 'top' },
];

// Tarjeta de producto reutilizable para las secciones de la portada
function TarjetaProducto({ item, variante = 'normal', puesto, onAdd }) {
  const [anadido, setAnadido] = useState(false);

  // Usamos la primera VARIANTE: es lo que Shopify necesita para el pago
  const varianteShopify = item.variantes?.[0];
  if (!varianteShopify) return null;

  const precio = Number(varianteShopify.price?.amount || 0);
  // Cantidad de la variante (p. ej. "250 gr"). "Default Title" = producto sin opciones
  const cantidad = varianteShopify.title !== 'Default Title' ? varianteShopify.title : null;

  const agotado = varianteShopify.availableForSale === false;
  const esCampana = variante === 'campana';

  const handleAdd = () => {
    onAdd({
      id: varianteShopify.id, // ID de la variante (gid://shopify/ProductVariant/...)
      title:
        cantidad
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
      className={`card product-card flex-shrink-0 ${esCampana ? 'border-warning' : ''}`}
      style={{ width: '250px' }}
    >
      {/* Número de puesto en Top ventas */}
      {puesto && (
        <span
          className="badge rounded-pill position-absolute m-2 fs-6"
          style={{ top: 0, left: 0, zIndex: 1, backgroundColor: '#556b2f' }}
        >
          Nº {puesto}
        </span>
      )}

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
          {cantidad && <span className="fw-normal text-muted small"> · {cantidad}</span>}
          <span className="d-block fw-normal text-muted" style={{ fontSize: '0.75rem' }}>
            IVA incluido
          </span>
        </p>

        <button
          className={`btn w-100 mt-auto ${esCampana ? 'btn-outline-danger' : 'btn-success'}`}
          onClick={handleAdd}
          disabled={agotado}
        >
          {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}

// Barra de categorías: se desliza con el dedo o el ratón, y con flechas cuando no caben todas
function BarraCategorias() {
  const listaRef = useRef(null);
  const [flechas, setFlechas] = useState({ izquierda: false, derecha: false });

  // Comprueba si hay más pestañas escondidas a cada lado
  const actualizarFlechas = useCallback(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const { scrollLeft, scrollWidth, clientWidth } = lista;
    setFlechas({
      izquierda: scrollLeft > 4,
      derecha: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    actualizarFlechas();
    window.addEventListener('resize', actualizarFlechas);
    return () => window.removeEventListener('resize', actualizarFlechas);
  }, [actualizarFlechas]);

  const desplazar = (direccion) => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollBy({ left: direccion * lista.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <nav className="categorias" aria-label="Categorías">
      <div className="categorias-contenedor">
        {flechas.izquierda && (
          <button
            type="button"
            className="categorias-flecha categorias-flecha-izq"
            onClick={() => desplazar(-1)}
            aria-label="Ver categorías anteriores"
          >
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
        )}

        <ul className="categorias-lista" ref={listaRef} onScroll={actualizarFlechas}>
          {CATEGORIAS.map((cat) => (
            <li key={cat.ruta}>
              <Link className="categoria-pill" to={cat.ruta}>
                <span className="categoria-icono" aria-hidden="true">
                  {cat.icono.startsWith('/') ? (
                    <img src={cat.icono} alt="" width="24" height="24" onLoad={actualizarFlechas} />
                  ) : (
                    cat.icono
                  )}
                </span>
                {cat.nombre}
              </Link>
            </li>
          ))}
        </ul>

        {flechas.derecha && (
          <button
            type="button"
            className="categorias-flecha categorias-flecha-der"
            onClick={() => desplazar(1)}
            aria-label="Ver más categorías"
          >
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </nav>
  );
}

function Home() {
  const [productos, setProductos] = useState({}); // { clave: [productos] }
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function cargarHome() {
      // allSettled: si una sección falla, las demás se muestran igualmente
      const resultados = await Promise.allSettled(
        SECCIONES.map((sec) => (sec.top ? getTopVentas(10) : getCollectionProducts(sec.coleccion)))
      );

      const porSeccion = {};
      resultados.forEach((res, i) => {
        const { clave, titulo } = SECCIONES[i];
        if (res.status === 'fulfilled') {
          porSeccion[clave] = res.value || [];
        } else {
          console.error(`Error al cargar ${titulo}:`, res.reason);
          porSeccion[clave] = [];
        }
      });

      setProductos(porSeccion);
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

  const seccionesConProductos = SECCIONES.filter((sec) => (productos[sec.clave] || []).length > 0);

  return (
    <div className="container-home">
      {/* Título principal para Google y lectores de pantalla (no se ve) */}
      <h1 className="visually-hidden">
        El Puesto de la Dieta: encurtidos, gildas, especias, dulces y frutos secos
      </h1>

      {/* 1. Pestañas de categorías */}
      <BarraCategorias />

      {/* 2. Secciones de productos (Productos de campaña, Productos destacados, Top ventas) */}
      {seccionesConProductos.map((sec) => {
        const esCampana = sec.estilo === 'campana';
        return (
          <section
            key={sec.clave}
            className={`container py-5 ${esCampana ? 'bg-light rounded-4' : ''}`}
          >
            <div className={`d-flex justify-content-between align-items-center mb-4 ${esCampana ? 'px-3' : ''}`}>
              <h2 className={`section-title mb-0 ${esCampana ? 'text-danger' : ''}`}>{sec.titulo}</h2>
            </div>

            <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
              {productos[sec.clave].map((item, i) => (
                <TarjetaProducto
                  key={item.id}
                  item={item}
                  variante={sec.estilo}
                  puesto={sec.estilo === 'top' ? i + 1 : undefined}
                  onAdd={addToCart}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Si Shopify no devuelve nada, avisamos en lugar de dejar la página vacía */}
      {seccionesConProductos.length === 0 && (
        <div className="container py-5 text-center text-muted">
          <p className="mb-3">Estamos preparando el puesto. Echa un vistazo a nuestras categorías:</p>
          <Link to="/aceitunas" className="btn btn-success rounded-pill px-4" style={{ backgroundColor: '#556b2f', border: 'none' }}>Ver productos</Link>
        </div>
      )}

      {/* 3. Preguntas frecuentes */}
      <PreguntasFrecuentes />
    </div>
  );
}

export default Home;