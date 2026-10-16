import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';

// Tamaño del icono del carrito (un poco más pequeño que el logo)
const TAM_ICONO = 'clamp(2.25rem, 4.5vw, 3.25rem)'; // 36px en móvil → 52px en ordenador

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ backgroundColor: '#556b2f' }}>
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center p-0" to="/" aria-label="El Puesto de la Dieta - Inicio">
          <img
            src="/logo-puesto.png"
            alt="El Puesto de la Dieta"
            width="96"
            height="96"
            className="rounded-circle bg-white shadow"
            style={{
              width: 'clamp(64px, 8vw, 96px)',
              height: 'clamp(64px, 8vw, 96px)',
              objectFit: 'contain',
              margin: '-8px 0',
            }}
          />
        </Link>

        {/* CARRITO */}
        <Link
          to="/carrito"
          className="text-white position-relative d-flex align-items-center"
          aria-label={cartCount > 0 ? `Ver carrito (${cartCount} productos)` : 'Ver carrito'}
        >
          <i className="bi bi-basket2-fill" style={{ fontSize: TAM_ICONO, lineHeight: 1 }}></i>
          {cartCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.8rem' }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;