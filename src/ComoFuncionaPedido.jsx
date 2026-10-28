import './styles/ComoFuncionaPedido.css';

// ================= ¿QUÉ PASA DESPUÉS DE PAGAR? =================
// Pasos que ve el cliente en el carrito (plegados: se abren al pulsar).
// Para cambiar un texto, toca solo esta lista. Deben coincidir con la Política de envíos.
const PASOS = [
  {
    titulo: 'Recibimos tu pedido',
    texto: 'Nada más pagar te llegará un email con la confirmación y el número de tu pedido.',
  },
  {
    titulo: 'Lo preparamos a mano',
    texto:
      'Preparamos cada pedido en nuestro almacén con el máximo cuidado para que llegue en perfectas condiciones.',
  },
  {
    titulo: 'Sale hacia tu casa',
    texto:
      'Cuando lo entreguemos a TIPSA te enviaremos el número de seguimiento. Llega en 3 a 5 días hábiles desde la compra.',
  },
  {
    titulo: 'Atento al timbre y al teléfono',
    texto:
      'Si no estás en casa, la mensajería se pondrá en contacto contigo para acordar una nueva entrega.',
  },
  {
    titulo: '¿Algún problema?',
    texto:
      'Si tu pedido llega dañado o con algún error, avísanos en 48 horas con una foto y lo solucionamos.',
  },
];

function ComoFuncionaPedido() {
  return (
    // Plegado por defecto para no ocupar sitio: se abre al pulsar el título
    <details className="card border-0 shadow-sm como-funciona">
      <summary className="como-funciona-titulo p-3 px-4 d-flex align-items-center gap-2">
        <i className="bi bi-truck fs-5" aria-hidden="true"></i>
        <span className="fw-bold flex-grow-1">¿Qué pasa después de pagar?</span>
        <i className="bi bi-chevron-down como-funciona-flecha" aria-hidden="true"></i>
      </summary>

      <div className="px-4 pb-3">
        <p className="text-muted small mb-3">Así llega tu pedido desde nuestro almacén hasta tu casa.</p>

        <ol className="list-unstyled mb-0">
          {PASOS.map((paso, i) => (
            <li key={paso.titulo} className="d-flex gap-3 mb-3">
              {/* Número del paso en un círculo verde */}
              <span
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
                style={{ width: '2rem', height: '2rem', backgroundColor: '#556b2f' }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="fs-6 fw-bold mb-1">{paso.titulo}</h3>
                <p className="text-muted small mb-0">{paso.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

export default ComoFuncionaPedido;