import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

function FrutosSecos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  const [variantesSeleccionadas, setVariantesSeleccionadas] =
    useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setLoading(true);

      const frutosSecos =
        await getCollectionProducts(
          'frutos-secos'
        );

      const frutasDeshidratadas =
        await getCollectionProducts(
          'frutas-deshidratadas'
        );

      const todosLosProductos = [
        ...frutosSecos.map(item => ({
          ...item,
          subcategoria1: 'frutos secos'
        })),
        ...frutasDeshidratadas.map(item => ({
          ...item,
          subcategoria1: 'frutas deshidratadas'
        }))
      ];

      setProductos(todosLosProductos);

      const iniciales = {};

      todosLosProductos.forEach(producto => {
        if (producto.variantes?.length > 0) {
          iniciales[producto.id] =
            producto.variantes[0].id;
        }
      });

      setVariantesSeleccionadas(iniciales);

    } catch (error) {
      console.error(
        'Error obteniendo productos:',
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

  const productosFiltrados = productos.filter(item => {
    if (filtro === 'todos') return true;
    return item.subcategoria1 === filtro;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-grow text-danger"
          role="status"
        ></div>

        <p className="mt-2">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">

        <h1
          className="display-4 fw-bold"
          style={{ color: '#8d6e63' }}
        >
          Frutos Secos y Frutas Deshidratadas
        </h1>
        <p className="lead text-muted">
          El clásico que nunca falla. Abre, comparte y que empiece el crujido.
        </p>

        <div className="btn-group mt-3 shadow-sm">

          <button
            className={`btn ${filtro === 'todos'
                ? 'btn-danger'
                : 'btn-outline-danger'
              }`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>

          <button
            className={`btn ${filtro === 'frutos secos'
                ? 'btn-danger'
                : 'btn-outline-danger'
              }`}
            onClick={() => setFiltro('frutos secos')}
          >
            Frutos secos
          </button>

          <button
            className={`btn ${filtro === 'frutas deshidratadas'
                ? 'btn-danger'
                : 'btn-outline-danger'
              }`}
            onClick={() => setFiltro('frutas deshidratadas')}
          >
            Frutas deshidratadas
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
                        value={
                          varianteActualId || ''
                        }
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
                    ).toFixed(2)}
                    €
                  </p>

                  <button
                    className="btn btn-outline-danger mt-auto"
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

export default FrutosSecos;