import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

function Dulces() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);

  const [variantesSeleccionadas, setVariantesSeleccionadas] =
    useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    cargarDulces();
  }, []);

  async function cargarDulces() {
    try {
      setCargando(true);

      const conAzucar =
        await getCollectionProducts('dulces-con-azucar');

      const sinAzucar =
        await getCollectionProducts('dulces-sin-azucar');

      const productosFinales = [
        ...conAzucar.map(item => ({
          ...item,
          subcategoria: 'con azucar'
        })),
        ...sinAzucar.map(item => ({
          ...item,
          subcategoria: 'sin azucar'
        }))
      ];

      setProductos(productosFinales);

      const iniciales = {};

      productosFinales.forEach(producto => {
        if (producto.variantes?.length > 0) {
          iniciales[producto.id] =
            producto.variantes[0].id;
        }
      });

      setVariantesSeleccionadas(iniciales);

    } catch (error) {
      console.error(
        'Error cargando dulces:',
        error
      );
    } finally {
      setCargando(false);
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

  const productosFiltrados = productos.filter(item => {
    if (filtro === 'todos') return true;
    return item.subcategoria === filtro;
  });

  if (cargando) {
    return (
      <div className="text-center py-5">
        Endulzando la página...
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">

        <h1 className="display-4 fw-bold text-danger">
          Nuestros Dulces
        </h1>

        <p className="lead text-muted">
          Tu momento más dulce. Bocados que alegran el día.
        </p>

        <div
          className="btn-group mt-3 shadow-sm"
          role="group"
        >
          <button
            onClick={() => setFiltro('todos')}
            className={`btn ${
              filtro === 'todos'
                ? 'btn-danger'
                : 'btn-outline-danger'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setFiltro('con azucar')}
            className={`btn ${
              filtro === 'con azucar'
                ? 'btn-danger'
                : 'btn-outline-danger'
            }`}
          >
            Con Azúcar
          </button>

          <button
            onClick={() => setFiltro('sin azucar')}
            className={`btn ${
              filtro === 'sin azucar'
                ? 'btn-danger'
                : 'btn-outline-danger'
            }`}
          >
            Sin Azúcar
          </button>
        </div>

      </div>

      <div className="row g-4">

        {productosFiltrados.map(item => {

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

                <span
                  className={`badge position-absolute m-2 ${
                    item.subcategoria === 'sin azucar'
                      ? 'bg-info'
                      : 'bg-warning text-dark'
                  }`}
                  style={{
                    top: 0,
                    right: 0
                  }}
                >
                  {item.subcategoria}
                </span>

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

                  <p className="fs-4 fw-bold text-danger">
                    {parseFloat(
                      varianteActual?.price?.amount || 0
                    ).toFixed(2)}€
                  </p>

                  <button
                    className="btn btn-danger mt-auto"
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
        })}

      </div>

    </div>
  );
}

export default Dulces;