import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { useCart } from './context/CartContext';
import { getCollectionProducts } from './shopifyClient';

function Gildas() {
  const [gildas, setGildas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [variantesSeleccionadas, setVariantesSeleccionadas] =
    useState({});

  const [mostrarMix, setMostrarMix] = useState(false);
  const [mix, setMix] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    cargarGildas();
  }, []);

  async function cargarGildas() {
    try {
      setLoading(true);

      const productosShopify =
        await getCollectionProducts('gildas');

      setGildas(productosShopify);

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
        'Error cargando gildas:',
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

  const MAX_GRAMOS = 1500;

  const actualizarMix = (nombre, gramos) => {
    gramos = Number(gramos);

    const mixActual = {
      ...mix,
      [nombre]: gramos
    };

    const nuevoTotal = Object.values(
      mixActual
    ).reduce(
      (acc, valor) => acc + valor,
      0
    );

    if (nuevoTotal > MAX_GRAMOS) {
      alert(
        'El máximo permitido para el mix es 1,5 kg'
      );
      return;
    }

    setMix(mixActual);
  };

  const totalGramos = Object.values(mix).reduce(
    (acc, gramos) => acc + gramos,
    0
  );

  const precioMix =
    totalGramos <= 1000
      ? 50
      : 75;

  const añadirMixAlCarrito = () => {

    if (
      totalGramos !== 1000 &&
      totalGramos !== 1500
    ) {
      alert(
        'El mix debe ser exactamente de 1kg o 1,5kg'
      );
      return;
    }

    const seleccionadas = Object.entries(mix)
      .filter(([_, gramos]) => gramos > 0);

    if (seleccionadas.length === 0) {
      alert('Selecciona alguna gilda');
      return;
    }

    const descripcion = seleccionadas
      .map(
        ([nombre, gramos]) =>
          `${nombre}: ${gramos}g`
      )
      .join(', ');

    addToCart({
      id: variantIdReal || `mix-${Date.now()}`,
      title: 'Mix de Gildas Personalizado',
      price: precioMix,
      image:
        gildas.find(g =>
          g.nombre
            .toLowerCase()
            .includes('mix')
        )?.imagen_url || '',
      descripcion
    });

    setMostrarMix(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-success"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">
          Nuestras Gildas
        </h1>

        <p className="lead text-muted">
          La reina del picoteo. Un clásico que siempre te deja con ganas de otra.
        </p>

        <hr className="w-25 mx-auto border-success border-2 opacity-50" />
      </div>

      <div className="row g-4 justify-content-center">

        {gildas.map(gilda => {

          const varianteActualId =
            variantesSeleccionadas[gilda.id];

          const varianteActual =
            gilda.variantes?.find(
              v => v.id === varianteActualId
            ) || gilda.variantes?.[0];

          return (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={gilda.id}
            >
              <div className="card h-100 shadow-sm border-0 product-card">

                <img
                  src={gilda.imagen_url}
                  alt={gilda.nombre}
                  className="card-img-top"
                  style={{
                    height: '250px',
                    objectFit: 'cover'
                  }}
                />

                <div className="card-body d-flex flex-column text-center">

                  <h4 className="fw-bold">
                    {gilda.nombre}
                  </h4>

                  <p className="text-muted small">
                    {gilda.descripcion}
                  </p>

                  {gilda.variantes?.length > 1 && (
                    <div className="mb-3">

                      <label className="form-label small fw-bold">
                        Selecciona cantidad
                      </label>

                      <select
                        className="form-select"
                        value={varianteActualId || ''}
                        onChange={(e) =>
                          handleCambioVariante(
                            gilda.id,
                            e.target.value
                          )
                        }
                      >
                        {gilda.variantes.map(v => (
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

                  {gilda.nombre
                    .toLowerCase()
                    .includes('mix') ? (

                    <button
                      className="btn btn-warning mt-auto"
                      onClick={() =>
                        setMostrarMix(true)
                      }
                    >
                      Crear mi mix
                    </button>

                  ) : (

                    <button
                      className="btn btn-success mt-auto"
                      onClick={() =>
                        addToCart({
                          id: varianteActual.id,
                          title: `${gilda.nombre} (${varianteActual.title})`,
                          price: parseFloat(
                            varianteActual.price.amount
                          ),
                          image: gilda.imagen_url
                        })
                      }
                    >
                      Añadir al carrito
                    </button>

                  )}

                </div>
              </div>
            </div>
          );
        })}

      </div>

      {mostrarMix && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              'rgba(0,0,0,0.5)'
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Crear Mix de Gildas
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setMostrarMix(false)
                  }
                />
              </div>

              <div className="modal-body">

                {gildas
                  .filter(
                    g =>
                      !g.nombre
                        .toLowerCase()
                        .includes('mix')
                  )
                  .map(gilda => (
                    <div
                      key={gilda.id}
                      className="d-flex justify-content-between align-items-center mb-3"
                    >
                      <span>
                        {gilda.nombre}
                      </span>

                      <select
                        className="form-select w-auto"
                        onChange={(e) =>
                          actualizarMix(
                            gilda.nombre,
                            e.target.value
                          )
                        }
                      >
                        <option value="0">0g</option>
                        <option value="100">100g</option>
                        <option value="200">200g</option>
                        <option value="300">300g</option>
                        <option value="400">400g</option>
                        <option value="500">500g</option>
                      </select>
                    </div>
                  ))}

                <hr />

                <h5>
                  Total seleccionado:
                  {' '}
                  {totalGramos}g
                </h5>

                <h4 className="text-success">
                  Precio: {precioMix}€
                </h4>

                <p className="text-muted">
                  Disponible:
                  {' '}
                  {MAX_GRAMOS - totalGramos}g
                </p>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setMostrarMix(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success"
                  onClick={
                    añadirMixAlCarrito
                  }
                >
                  Añadir Mix al carrito
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Gildas;