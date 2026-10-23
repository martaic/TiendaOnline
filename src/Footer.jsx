import './styles/Footer.css';
import { Link } from 'react-router-dom';

// Redes sociales (cámbialas solo aquí)
const REDES = [
  { nombre: 'Instagram', icono: 'bi-instagram', url: 'https://www.instagram.com/elpuestodeladieta/' },
  { nombre: 'TikTok', icono: 'bi-tiktok', url: 'https://www.tiktok.com/@elpuestodeladieta' },
];

// Políticas legales: se editan en Shopify (Configuración → Políticas)
const URL_POLITICAS = 'https://tienda.elpuestodeladieta.es/policies';
const LEGALES = [
  { nombre: 'Aviso legal', ruta: 'legal-notice' },
  { nombre: 'Privacidad', ruta: 'privacy-policy' },
  { nombre: 'Términos del servicio', ruta: 'terms-of-service' },
  { nombre: 'Devoluciones y reembolsos', ruta: 'refund-policy' },
];

function Footer() {
  const anioActual = new Date().getFullYear(); // se actualiza solo cada año

  return (
    <footer className="footer-custom">
      <div className="container py-5">
        <div className="row">
          {/* Columna 1: Nombre */}
          <div className="col-md-4 mb-4">
            <h2 className="text-uppercase fw-bold fs-5">El Puesto de la Dieta</h2>
            <p>
              Calidad y tradición en cada bocado. Especialistas en encurtidos, frutos secos y
              productos artesanales.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <nav className="col-md-4 mb-4" aria-label="Enlaces del pie de página">
            <h2 className="text-uppercase fw-bold fs-5">Enlaces</h2>
            <ul className="list-unstyled">
              <li>
                <Link to="/sobre-nosotros" className="footer-link">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/politica-envios" className="footer-link">
                  Política de envíos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="footer-link">
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Columna 3: Redes sociales */}
          <div className="col-md-4 mb-4 text-center">
            <h2 className="text-uppercase fw-bold fs-5">Síguenos</h2>
            <div className="d-flex justify-content-center gap-3 mt-3">
              {REDES.map((red) => (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={`${red.nombre} de El Puesto de la Dieta (se abre en una pestaña nueva)`}
                >
                  <i className={`bi ${red.icono}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="bg-light" />

        <div className="text-center pt-3">
          <ul className="list-inline small mb-2">
            {LEGALES.map((legal) => (
              <li key={legal.ruta} className="list-inline-item mx-2">
                <a
                  href={`${URL_POLITICAS}/${legal.ruta}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {legal.nombre}
                </a>
              </li>
            ))}
          </ul>
          <p className="mb-0">
            &copy; {anioActual} El Puesto de la Dieta. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;