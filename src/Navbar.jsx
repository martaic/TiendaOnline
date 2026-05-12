import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { supabase } from './supabaseClient';

function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" 
      style={{ backgroundColor: '#556b2f' }} // <-- Tu color personalizado
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <i className="bi bi-shop-window"></i> {/* <-- Tu icono de tienda */}
          El puesto de la dieta
        </Link>

        <div className="d-flex align-items-center gap-4">
          
          {/* LÓGICA DEL BOTÓN DE USUARIO */}
          {user ? (
            <div className="dropdown">
              <button 
                className="btn text-white p-0 dropdown-toggle hide-caret" 
                type="button" 
                data-bs-toggle="dropdown" 
              >
                <i className="bi bi-person-check-fill fs-4"></i>
              </button>
              
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li>
                  <h6 className="dropdown-header border-bottom pb-2 mb-2 text-dark text-truncate" style={{maxWidth: '200px'}}>
                    {user.email}
                  </h6>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2" to="/perfil">
                    <i className="bi bi-person text-success"></i> Mi Cuenta
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center gap-2" to="/pedidos">
                    <i className="bi bi-box-seam text-success"></i> Mis Pedidos
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item d-flex align-items-center gap-2 text-danger" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="text-white fs-4">
              <i className="bi bi-person-circle"></i>
            </Link>
          )}

          {/* Icono del Carrito */}
          <Link to="/carrito" className="text-white fs-4 position-relative">
            <i className="bi bi-cart3"></i>
            {cartCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                style={{ fontSize: '0.6rem' }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;