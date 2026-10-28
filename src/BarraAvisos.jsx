import { useState } from 'react';
import { Link } from 'react-router-dom';

// ================= BARRA DE AVISOS =================
// Para CAMBIAR el aviso: modifica los datos de AVISO.
// Para QUITARLA: pon  const AVISO = null;
//
// texto:  lo que se lee en la barra
// enlace: (opcional) a qué página lleva el botón, y su texto
// hasta:  (opcional) fecha en la que DEJA de verse sola (AAAA-MM-DD). Ese día ya no aparece.
// fondo:  color de la barra
const AVISO = {
  texto: 'Prepara tu bolsa de caramelos antes de que lleguen los fantasmas',
  enlace: { ruta: '/caramelos', texto: 'Ver caramelos' },
  hasta: '2026-11-01',
  fondo: '#4b2470', // morado Halloween (para Navidad, por ejemplo '#8b1e1e')
};

// Ejemplo para Navidad (copia esto encima de AVISO cuando toque):
// const AVISO = {
//   texto: 'Pedidos para Navidad: haz tu pedido antes del 18 de diciembre',
//   enlace: { ruta: '/dulces', texto: 'Ver dulces' },
//   hasta: '2026-12-26',
//   fondo: '#8b1e1e',
// };

function avisoVigente() {
  if (!AVISO) return false;
  if (!AVISO.hasta) return true;
  const hoy = new Date().toISOString().slice(0, 10); // AAAA-MM-DD
  return hoy < AVISO.hasta;
}

function BarraAvisos() {
  const [cerrado, setCerrado] = useState(false);

  if (cerrado || !avisoVigente()) return null;

  return (
    <div
      className="text-white text-center small py-2 px-5 position-relative"
      style={{ backgroundColor: AVISO.fondo }}
      role="region"
      aria-label="Aviso"
    >
      <span className="fw-semibold">{AVISO.texto}</span>
      {AVISO.enlace && (
        <Link to={AVISO.enlace.ruta} className="text-white fw-bold ms-2">
          {AVISO.enlace.texto}
        </Link>
      )}

      <button
        type="button"
        className="btn-close btn-close-white position-absolute top-50 end-0 translate-middle-y me-3"
        style={{ fontSize: '0.7rem' }}
        aria-label="Cerrar aviso"
        onClick={() => setCerrado(true)}
      ></button>
    </div>
  );
}

export default BarraAvisos;