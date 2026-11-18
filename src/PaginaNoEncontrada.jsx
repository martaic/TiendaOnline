import { Link } from 'react-router-dom';
import useSeo from './hooks/useSeo';

// Página que sale cuando la dirección no existe (error 404)
function PaginaNoEncontrada() {
  // Le decimos a Google que no guarde esta página
  useSeo({ titulo: 'Página no encontrada', noindex: true });

  return (
    <div className="container py-5 text-center" style={{ minHeight: '50vh' }}>
      <i className="bi bi-signpost-split display-1 text-success" aria-hidden="true"></i>
      <h1 className="fw-bold text-success mt-3">Esta página no existe</h1>
      <p className="lead text-muted mb-4">
        Puede que el enlace esté mal escrito o que el producto ya no esté disponible.
      </p>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <Link
          to="/"
          className="btn btn-success rounded-pill px-4"
          style={{ backgroundColor: '#556b2f', border: 'none' }}
        >
          Ir a la tienda
        </Link>
        <Link to="/buscar" className="btn btn-outline-success rounded-pill px-4">
          <i className="bi bi-search me-1" aria-hidden="true"></i>Buscar un producto
        </Link>
      </div>
    </div>
  );
}

export default PaginaNoEncontrada;
