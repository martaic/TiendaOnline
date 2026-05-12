import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

function Aceitunas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [variantesSeleccionadas, setVariantesSeleccionadas] = useState({});

  // Estado para controlar qué producto se muestra en la ventana emergente
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    cargarAceitunas();
  }, []);

  async function cargarAceitunas() {
    try {
      setCargando(true);
      const productosShopify = await getCollectionProducts('encurtidos');
      setProductos(productosShopify);

      const iniciales = {};
      productosShopify.forEach(producto => {
        if (producto.variantes?.length > 0) {
          iniciales[producto.id] = producto.variantes[0].id;
        }
      });
      setVariantesSeleccionadas(iniciales);

    } catch (error) {
      console.error('Error cargando aceitunas:', error);
    } finally {
      setCargando(false);
    }
  }

  const handleCambioVariante = (productoId, varianteId) => {
    setVariantesSeleccionadas(prev => ({
      ...prev,
      [productoId]: varianteId
    }));
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        Cargando las mejores aceitunas...
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1
          className="fw-bold text-success"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Nuestras Aceitunas
        </h1>
        <p className="lead text-muted">
          Directamente del puesto a tu mesa.
        </p>
        <hr className="w-25 mx-auto border-success border-2" />
      </div>

      <div className="row g-4">
        {productos.map(item => {
          const varianteActualId = variantesSeleccionadas[item.id];
          const varianteActual = item.variantes?.find(
            v => v.id === varianteActualId
          ) || item.variantes?.[0];

          return (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 product-card">

                {/* Hacer clic aquí abre los ingredientes */}
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  className="card-img-top"
                  style={{
                    height: '220px',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => setProductoSeleccionado(item)}
                />

                <div className="card-body d-flex flex-column text-center">

                  {/* Hacer clic en el título también abre los ingredientes */}
                  <h5
                    className="card-title fw-bold"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProductoSeleccionado(item)}
                  >
                    {item.nombre}
                  </h5>

                  {/* Enlace sutil informativo para el cliente */}
                  <p
                    className="text-success small mb-3"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => setProductoSeleccionado(item)}
                  >
                    Ver ingredientes e información
                  </p>

                  {item.variantes?.length > 1 && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Selecciona cantidad
                      </label>
                      <select
                        className="form-select"
                        value={varianteActualId || ''}
                        onChange={(e) =>
                          handleCambioVariante(item.id, e.target.value)
                        }
                      >
                        {item.variantes.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <p className="fs-4 fw-bold text-success mt-auto mb-3">
                    {parseFloat(varianteActual?.price?.amount || 0).toFixed(2)}€
                  </p>

                  <button
                    className="btn btn-success w-100"
                    onClick={() =>
                      addToCart({
                        id: varianteActual.id,
                        title: `${item.nombre} (${varianteActual.title})`,
                        price: parseFloat(varianteActual.price.amount),
                        image: item.imagen_url
                      })
                    }
                  >
                    Añadir al carrito
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= VENTANA EMERGENTE (MODAL) ================= */}
      {productoSeleccionado && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
          onClick={() => setProductoSeleccionado(null)} // Cierra al pulsar fuera
        >
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">

              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">{productoSeleccionado.nombre}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setProductoSeleccionado(null)}
                ></button>
              </div>

              <div className="modal-body text-center p-4">
                <img
                  src={productoSeleccionado.imagen_url}
                  alt={productoSeleccionado.nombre}
                  className="img-fluid rounded mb-3 shadow-sm"
                  style={{ maxHeight: '240px', width: '100%', objectFit: 'cover' }}
                />

                <div className="text-start mt-3">
                  <h6 className="fw-bold text-success">📋 Ingredientes y Alérgenos:</h6>
                  <p className="text-muted bg-light p-3 rounded" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {productoSeleccionado.descripcion || "No se han especificado los ingredientes de este artículo."}
                  </p>
                </div>
              </div>

              <div className="modal-footer border-0 p-3">
                <button
                  type="button"
                  className="btn btn-secondary w-100 py-2 fw-bold"
                  onClick={() => setProductoSeleccionado(null)}
                >
                  Cerrar e ir a la tienda
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Aceitunas;