import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

function Especias() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [variantesSeleccionadas, setVariantesSeleccionadas] =
    useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    cargarEspecias();
  }, []);

  async function cargarEspecias() {
    try {
      setLoading(true);

      const productosShopify =
        await getCollectionProducts('especias');

      setProductos(productosShopify);

      const iniciales = {};

      productosShopify.forEach(producto => {
        if (producto.variantes?.length > 0) {
          iniciales[producto.id] =
            producto.variantes[0].id;
        }
      });

      setVariantesSeleccionadas(iniciales);

    } catch (error) {
      console.error(
        'Error cargando especias:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const handleCambioVariante = (
    productoId,
    varianteId
  ) => {
    setVariantesSeleccionadas(prev => ({
      ...prev,
      [productoId]: varianteId
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        Cargando especias...
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">
          Nuestras Especias
        </h1>

        <p className="lead text-muted">
          Esencias naturales para sazonar la vida y disfrutar sorbo a sorbo.
        </p>

        <hr className="w-25 mx-auto border-success border-2" />
      </div>

      <div className="row g-4">

        {productos.length > 0 ? (
          productos.map(item => {

            const varianteActualId =
              variantesSeleccionadas[item.id];

            const varianteActual =
              item.variantes?.find(
                v => v.id === varianteActualId
              ) || item.variantes?.[0];

            return (
              <div
                key={item.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div className="card h-100 shadow-sm border-0 product-card">

                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="card-img-top"
                    style={{
                      height: '220px',
                      objectFit: 'cover'
                    }}
                  />

                  <div className="card-body d-flex flex-column text-center">

                    <h5 className="card-title fw-bold">
                      {item.nombre}
                    </h5>

                    <p className="text-muted small">
                      {item.descripcion}
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
                            handleCambioVariante(
                              item.id,
                              e.target.value
                            )
                          }
                        >
                          {item.variantes.map(v => (
                            <option
                              key={v.id}
                              value={v.id}
                            >
                              {v.title}
                            </option>
                          ))}
                        </select>

                      </div>
                    )}

                    <p className="fs-4 fw-bold text-success">
                      {parseFloat(
                        varianteActual?.price?.amount || 0
                      ).toFixed(2)}€
                    </p>

                    <button
                      className="btn btn-success mt-auto"
                      onClick={() =>
                        addToCart({
                          id: varianteActual.id,
                          title: `${item.nombre} (${varianteActual.title})`,
                          price: parseFloat(
                            varianteActual.price.amount
                          ),
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
          })
        ) : (
          <div className="text-center py-5">
            <p className="lead text-muted">
              No hay especias disponibles.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default Especias;