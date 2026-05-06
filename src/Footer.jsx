import './styles/Footer.css';

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container py-5">
        <div className="row">
          
          {/* Columna 1: Logo o Nombre */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">El puesto de la dieta</h5>
            <p>Calidad y tradición en cada bocado. Especialistas en aceitunas, encurtidos y productos artesanales.</p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Enlaces</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Sobre nosotros</a></li>
              <li><a href="#" className="footer-link">Política de envíos</a></li>
              <li><a href="#" className="footer-link">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div className="col-md-4 mb-4 text-center">
            <h5 className="text-uppercase fw-bold">Síguenos</h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <a href="https://www.instagram.com/elpuestodeladieta/" target="https://www.instagram.com/elpuestodeladieta/" rel="https://www.instagram.com/elpuestodeladieta/" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@elpuestodeladieta" target="https://www.instagram.com/elpuestodeladieta/" rel="https://www.instagram.com/elpuestodeladieta/" className="social-icon">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="bg-light" />

        <div className="text-center pt-3">
          <p className="mb-0">&copy; 2026 El Puesto de la Dieta - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;