import { Link } from 'react-router-dom';
import { ListaPreguntas } from './PreguntasFrecuentes';
import useSeo from './hooks/useSeo';

// Página con TODAS las preguntas frecuentes (/preguntas-frecuentes).
// Las preguntas se cambian en PreguntasFrecuentes.jsx
function PaginaPreguntas() {
  // Título y descripción para Google
  useSeo({
    titulo: 'Preguntas frecuentes', ruta: '/preguntas-frecuentes',
    descripcion:
      'Resolvemos tus dudas sobre pedidos, formas de pago, envíos, alérgenos y devoluciones en la tienda online de El Puesto de la Dieta.',
  });

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-success text-center mb-3">Preguntas frecuentes</h1>
      <p className="lead text-muted text-center mb-5">
        Todo lo que necesitas saber sobre tus pedidos, pagos y envíos.
      </p>

      <ListaPreguntas />

      <div className="text-center mt-5">
        <p className="text-muted mb-3">¿No encuentras lo que buscas?</p>
        <Link
          to="/contacto"
          className="btn btn-success rounded-pill px-4"
          style={{ backgroundColor: '#556b2f', border: 'none' }}
        >
          Contacta con nosotros
        </Link>
      </div>
    </div>
  );
}

export default PaginaPreguntas;
