import { Link } from 'react-router-dom';
import './styles/PreguntasFrecuentes.css';

// ================= PREGUNTAS FRECUENTES =================
// Para añadir, quitar o cambiar una pregunta, toca solo esta lista.
// En el inicio solo salen las primeras (PREGUNTAS_EN_INICIO); el resto, en /preguntas-frecuentes.
// Pon arriba las más importantes.
// Los datos de envío deben coincidir con Shopify y con la Política de envíos.
const PREGUNTAS = [
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta: (
      <>
        Elige tus productos, pulsa <strong>Añadir al carrito</strong> y, cuando lo tengas todo,
        entra en el carrito y pulsa <strong>Confirmar y pagar</strong>. El pago se hace en una
        página segura de Shopify y recibirás un email con la confirmación del pedido.
      </>
    ),
  },
  {
    pregunta: '¿Cómo puedo pagar?',
    respuesta: (
      <>
        Con tarjeta de crédito o débito. En la página de pago verás todas las formas de pago
        disponibles en ese momento.
      </>
    ),
  },
  {
    pregunta: '¿A dónde enviáis?',
    respuesta: (
      <>
        A toda la <strong>España peninsular</strong>. De momento no enviamos a Baleares, Canarias,
        Ceuta ni Melilla.
      </>
    ),
  },
  {
    pregunta: '¿Cuánto cuesta el envío y cuánto tarda?',
    respuesta: (
      <>
        El envío cuesta <strong>4,99 €</strong> (IVA incluido) y llega con TIPSA en{' '}
        <strong>3 a 5 días hábiles</strong>. Cuando el pedido salga, te enviaremos el número de
        seguimiento por email. Más detalles en nuestra{' '}
        <Link to="/politica-envios">política de envíos</Link>.
      </>
    ),
  },
  {
    pregunta: '¿Dónde veo los ingredientes y alérgenos?',
    respuesta: (
      <>
        En cada producto, pulsa en <strong>Ingredientes</strong> o en la foto. Si tienes cualquier
        duda sobre alergias, escríbenos antes de hacer el pedido.
      </>
    ),
  },
  {
    pregunta: '¿Puedo devolver un pedido?',
    respuesta: (
      <>
        Puedes devolver productos sin abrir en un plazo de 14 días. Por seguridad alimentaria, no
        se admiten devoluciones de productos perecederos ni abiertos. Si tu pedido llega dañado o
        con un error, avísanos en 48 horas y lo solucionamos sin coste.{' '}
        <a
          href="https://tienda.elpuestodeladieta.es/policies/refund-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver política de devoluciones
        </a>
        .
      </>
    ),
  },
  {
    pregunta: 'Tengo otra duda, ¿cómo os contacto?',
    respuesta: (
      <>
        Escríbenos o llámanos desde la página de <Link to="/contacto">contacto</Link>. Te
        responderemos lo antes posible.
      </>
    ),
  },
];

// Cuántas preguntas se ven en la página de inicio
const PREGUNTAS_EN_INICIO = 4;

// resumen = true  -> versión corta para el inicio (4 preguntas + botón "Ver todas")
// resumen = false -> todas las preguntas (página /preguntas-frecuentes)
export function ListaPreguntas({ resumen = false }) {
  const visibles = resumen ? PREGUNTAS.slice(0, PREGUNTAS_EN_INICIO) : PREGUNTAS;

  return (
    <>
      <div className="faq mx-auto">
        {visibles.map(({ pregunta, respuesta }) => (
          // <details> abre y cierra cada pregunta sin necesidad de JavaScript
          <details key={pregunta} className="faq-item">
            <summary className="faq-pregunta">{pregunta}</summary>
            <div className="faq-respuesta">{respuesta}</div>
          </details>
        ))}
      </div>

      {resumen && PREGUNTAS.length > PREGUNTAS_EN_INICIO && (
        <div className="text-center mt-4">
          <Link
            to="/preguntas-frecuentes"
            className="btn btn-success rounded-pill px-4"
            style={{ backgroundColor: '#556b2f', border: 'none' }}
          >
            Ver todas las preguntas
          </Link>
        </div>
      )}
    </>
  );
}

// Bloque del inicio
function PreguntasFrecuentes() {
  return (
    <section className="container py-5" aria-labelledby="faq-titulo">
      <h2 id="faq-titulo" className="section-title faq-titulo mb-4">
        Preguntas frecuentes
      </h2>
      <ListaPreguntas resumen />
    </section>
  );
}

export default PreguntasFrecuentes;
