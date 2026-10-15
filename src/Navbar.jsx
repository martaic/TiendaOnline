import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { supabase } from './supabaseClient';

// Tamaño de los iconos de usuario y carrito (un poco más pequeños que el logo)
const TAM_ICONO = 'clamp(1.15rem, 3.4vw, 2.15rem)'; // 36px en móvil → 52px en ordenador

function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  // 1. Estado para el avatar (icono por defecto)
  const [avatar, setAvatar] = useState('bi-person-circle');

  // 2. Lógica de carga y tiempo real
  useEffect(() => {
    // Función para obtener el avatar de la DB
    const obtenerAvatar = async (userId) => {
      const { data } = await supabase
        .from('perfiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();
      
      if (data?.avatar_url) setAvatar(data.avatar_url);
    };

    if (user) {
      obtenerAvatar(user.id);

      // SUSCRIPCIÓN: Escucha si el usuario cambia su avatar en la página de Perfil
      const canal = supabase
        .channel('navbar-realtime')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'perfiles', filter: `id=eq.${user.id}` }, 
          (payload) => {
            if (payload.new.avatar_url) setAvatar(payload.new.avatar_url);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(canal);
      };
    } else {
      // Si no hay usuario, nos aseguramos de que el icono sea el de invitado
      setAvatar('bi-person-circle');
    }
  }, [user]);

  // 3. Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAvatar('bi-person-circle'); // Reseteamos al icono de invitado
    navigate('/');
  };

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

        <div className="d-flex align-items-center gap-4 gap-md-5">
          
          {/* SECCIÓN DE USUARIO (LOGUEADO O NO) */}
          {user ? (
            <div className="dropdown">
              <button className="btn text-white p-0 dropdown-toggle hide-caret" type="button" data-bs-toggle="dropdown">
                {/* Avatar dinámico para usuario logueado */}
                {avatar.startsWith('http') ? (
                  <img 
                    src={avatar} 
                    alt="perfil" 
                    className="rounded-circle border border-2 border-white" 
                    style={{ width: TAM_ICONO, height: TAM_ICONO, objectFit: 'cover' }} 
                  />
                ) : (
                  <i className={`bi ${avatar}`} style={{ fontSize: TAM_ICONO, lineHeight: 1 }}></i>
                )}
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
                  <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* Avatar dinámico para Invitado (Login) */
            <Link to="/login" className="text-white d-flex align-items-center" aria-label="Iniciar sesión">
              {avatar.startsWith('http') ? (
                <img 
                  src={avatar} 
                  alt="invitado" 
                  className="rounded-circle border border-1 border-white" 
                  style={{ width: TAM_ICONO, height: TAM_ICONO, objectFit: 'cover' }} 
                />
              ) : (
                <i className={`bi ${avatar}`} style={{ fontSize: TAM_ICONO, lineHeight: 1 }}></i>
              )}
            </Link>
          )}

          {/* CARRITO */}
          <Link to="/carrito" className="text-white position-relative d-flex align-items-center" aria-label="Ver carrito">
            <i className="bi bi-basket2-fill" style={{ fontSize: TAM_ICONO, lineHeight: 1 }}></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.8rem' }}>
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