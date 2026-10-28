import React, { useEffect, useState } from 'react';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';
import { createShopifyCheckout } from './services/shopifyCheckout';
import ComoFuncionaPedido from './ComoFuncionaPedido';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// ===== ENVÍO (debe coincidir con lo configurado en Shopify) =====
const COSTE_ENVIO = 4.99;
// Envío gratis desactivado de momento. Para volver a activarlo, pon el importe (p. ej. 50)
// y crea también la tarifa gratuita en Shopify
const ENVIO_GRATIS_DESDE = null;

function Carrito() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  // Título de la pestaña del navegador
  useEffect(() => {
    document.title = 'Tu carrito | El Puesto de la Dieta';
  }, []);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h1 className="mt-4 fs-2">Tu carrito está vacío</h1>
        <p className="text-secondary">¿A qué esperas para llenarlo de encurtidos o frutos secos?</p>
        <Link
          to="/"
          className="btn btn-success rounded-pill px-4"
          style={{ backgroundColor: '#556b2f', border: 'none' }}
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // Cálculos del envío
  const hayEnvioGratis = ENVIO_GRATIS_DESDE !== null;
  const envioGratis = hayEnvioGratis && cartTotal >= ENVIO_GRATIS_DESDE;
  const costeEnvio = envioGratis ? 0 : COSTE_ENVIO;
  const faltaParaGratis = hayEnvioGratis ? Math.max(0, ENVIO_GRATIS_DESDE - cartTotal) : 0;
  const progresoEnvio = hayEnvioGratis ? Math.min(100, (cartTotal / ENVIO_GRATIS_DESDE) * 100) : 0;

  const handleCheckout = async () => {
    setPagando(true);
    setErrorPago('');
    try {
      const checkoutUrl = await createShopifyCheckout(cart);
      // Llevamos al cliente a la página de pago segura de Shopify
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al crear el pago en Shopify:', error);
      setErrorPago(
        'No hemos podido iniciar el pago. Revisa tu carrito e inténtalo de nuevo. ' +
          'Si el problema continúa, escríbenos y te ayudamos.'
      );
      setPagando(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 fs-2">Tu carrito</h1>

      <div className="row g-4">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          {/* Aviso de envío gratis (solo si está activado) */}
          {hayEnvioGratis && (
            <div
              className={`card border-0 mb-3 p-3 ${envioGratis ? 'bg-success-subtle' : 'bg-light'}`}
              aria-live="polite"
            >
              <p className="mb-2 fw-semibold">
                {envioGratis ? (
                  <>¡Tienes <strong>envío gratis</strong>!</>
                ) : (
                  <>
                    Te faltan <strong>{formatearPrecio(faltaParaGratis)}</strong> para el{' '}
                    <strong>envío gratis</strong>
                  </>
                )}
              </p>
              <div
                className="progress"
                style={{ height: '8px' }}
                role="progressbar"
                aria-label="Progreso hacia el envío gratis"
                aria-valuenow={Math.round(progresoEnvio)}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${progresoEnvio}%`, backgroundColor: '#556b2f' }}
                ></div>
              </div>
            </div>
          )}

          {cart.map((item) => {
            const titulo = item.title || item.nombre || 'Producto';
            const precio = Number(item.price ?? item.precio ?? 0);
            const imagen = item.image || item.imagen_url;

            return (
              <div key={item.id} className="card shadow-sm border-0 mb-3 p-3">
                <div className="row align-items-center g-3">
                  <div className="col-3 col-md-2">
                    {imagen ? (
                      <img
                        src={imagen}
                        alt={titulo}
                        className="img-fluid rounded"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <i className="bi bi-image fs-3"></i>
                      </div>
                    )}
                  </div>

                  <div className="col-9 col-md-5">
                    <h2 className="mb-1 fw-bold fs-6">{titulo}</h2>
                    <p className="text-secondary mb-0 small">{formatearPrecio(precio)} / ud.</p>

                    {/* Por ejemplo, la composición del mix de gildas */}
                    {item.descripcion && (
                      <small className="text-muted d-block mt-1">{item.descripcion}</small>
                    )}
                  </div>

                  <div className="col-7 col-md-3">
                    <div className="input-group input-group-sm" style={{ maxWidth: '130px' }}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || pagando}
                        aria-label={`Quitar una unidad de ${titulo}`}
                      >
                        −
                      </button>
                      <span className="input-group-text bg-white px-3" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={pagando}
                        aria-label={`Añadir una unidad de ${titulo}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-5 col-md-2 text-end">
                    <div className="fw-bold mb-1">{formatearPrecio(precio * item.quantity)}</div>
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeFromCart(item.id)}
                      disabled={pagando}
                      aria-label={`Eliminar ${titulo} del carrito`}
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Link to="/" className="btn btn-link text-success px-0">
            <i className="bi bi-arrow-left me-1"></i> Seguir comprando
          </Link>
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light position-sticky" style={{ top: '1rem' }}>
            <h2 className="fw-bold mb-4 fs-4">Resumen</h2>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>{formatearPrecio(cartTotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span>
                Envío <span className="text-muted small">(TIPSA, 3-5 días hábiles)</span>
              </span>
              {envioGratis ? (
                <span className="text-success fw-bold">Gratis</span>
              ) : (
                <span>{formatearPrecio(costeEnvio)}</span>
              )}
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-1">
              <span className="h5 fw-bold mb-0">Total estimado</span>
              <span className="h5 fw-bold text-success mb-0">
                {formatearPrecio(cartTotal + costeEnvio)}
              </span>
            </div>
            <p className="text-muted small mb-4">
              IVA incluido. Envíos solo a la península.
            </p>

            {errorPago && (
              <div className="alert alert-danger small" role="alert">
                {errorPago}
              </div>
            )}

            <button
              type="button"
              className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow"
              style={{ backgroundColor: '#556b2f', border: 'none' }}
              onClick={handleCheckout}
              disabled={pagando}
            >
              {pagando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Preparando el pago...
                </>
              ) : (
                'Confirmar y pagar'
              )}
            </button>

            <p className="text-muted small text-center mt-3 mb-0">
              <i className="bi bi-lock-fill me-1"></i>
              Pago seguro con Shopify
            </p>
          </div>
        </div>

        {/* Pasos del pedido: qué ocurre después de pagar.
            Va después del resumen para que en el móvil el botón de pagar quede más arriba */}
        <div className="col-lg-8">
          <ComoFuncionaPedido />
        </div>
      </div>
    </div>
  );
}

export default Carrito;