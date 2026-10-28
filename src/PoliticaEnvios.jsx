import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ===== DATOS DE ENVÍO (deben coincidir con lo configurado en Shopify) =====
const TRANSPORTISTA = 'TIPSA';
const COSTE_ENVIO = '4,99 €';
// Envío gratis desactivado de momento. Para volver a activarlo, pon el importe (p. ej. '50 €')
const ENVIO_GRATIS_DESDE = null;
const PLAZO = '3 a 5 días hábiles';

// Con envío gratis hay 4 tarjetas en el resumen; sin él, 3
const COLUMNA = ENVIO_GRATIS_DESDE ? 'col-6 col-md-3' : 'col-12 col-sm-4';

function PoliticaEnvios() {
  useEffect(() => {
    document.title = 'Política de envíos | El Puesto de la Dieta';
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: '760px' }}>
      <h1 className="fw-bold text-success mb-3">Política de envíos</h1>
      <p className="lead text-muted mb-4">
        Preparamos todos los pedidos con el máximo cuidado para que los productos lleguen a tu
        casa en perfectas condiciones.
      </p>

      {/* Resumen rápido */}
      <div className="row g-3 mb-5 text-center">
        <div className={COLUMNA}>
          <div className="card border-0 shadow-sm h-100 p-3">
            <i className="bi bi-truck fs-2 text-success"></i>
            <div className="fw-bold mt-2">{TRANSPORTISTA}</div>
            <div className="small text-muted">a domicilio</div>
          </div>
        </div>
        <div className={COLUMNA}>
          <div className="card border-0 shadow-sm h-100 p-3">
            <i className="bi bi-cash-coin fs-2 text-success"></i>
            <div className="fw-bold mt-2">{COSTE_ENVIO}</div>
            <div className="small text-muted">IVA incluido</div>
          </div>
        </div>
        {ENVIO_GRATIS_DESDE && (
          <div className={COLUMNA}>
            <div className="card border-0 shadow-sm h-100 p-3">
              <i className="bi bi-gift fs-2 text-success"></i>
              <div className="fw-bold mt-2">Gratis</div>
              <div className="small text-muted">desde {ENVIO_GRATIS_DESDE}</div>
            </div>
          </div>
        )}
        <div className={COLUMNA}>
          <div className="card border-0 shadow-sm h-100 p-3">
            <i className="bi bi-clock fs-2 text-success"></i>
            <div className="fw-bold mt-2">{PLAZO}</div>
            <div className="small text-muted">plazo de entrega</div>
          </div>
        </div>
      </div>

      <h2 className="fs-4 fw-bold mt-4">¿A dónde enviamos?</h2>
      <p>
        Por ahora enviamos a toda la <strong>España peninsular</strong>. De momento no realizamos
        envíos a Baleares, Canarias, Ceuta ni Melilla.
      </p>

      <h2 className="fs-4 fw-bold mt-4">Gastos de envío</h2>
      <p>
        El envío cuesta <strong>{COSTE_ENVIO}</strong> (IVA incluido)
        {ENVIO_GRATIS_DESDE && (
          <>
            {' '}y es <strong>gratis en pedidos a partir de {ENVIO_GRATIS_DESDE}</strong>
          </>
        )}
        . Verás el importe exacto antes de finalizar la compra.
      </p>

      <h2 className="fs-4 fw-bold mt-4">Plazos de entrega</h2>
      <p>
        Los pedidos se entregan con {TRANSPORTISTA} en un plazo de <strong>{PLAZO}</strong> desde
        la confirmación del pedido. Los fines de semana y festivos no cuentan como días hábiles.
      </p>

      <h2 className="fs-4 fw-bold mt-4">Seguimiento del pedido</h2>
      <p>
        Cuando tu pedido salga de nuestro almacén, te enviaremos un email con el número de
        seguimiento para que puedas saber en todo momento dónde está.
      </p>

      <h2 className="fs-4 fw-bold mt-4">Incidencias</h2>
      <p>
        Si tu pedido llega dañado, incompleto o con algún error, escríbenos lo antes posible
        indicando tu número de pedido y, si puedes, con alguna foto. Lo resolveremos cuanto antes.
      </p>

      <div className="text-center mt-5">
        <Link
          to="/contacto"
          className="btn btn-success rounded-pill px-4"
          style={{ backgroundColor: '#556b2f', border: 'none' }}
        >
          ¿Tienes dudas? Contacta con nosotros
        </Link>
      </div>
    </div>
  );
}

export default PoliticaEnvios;