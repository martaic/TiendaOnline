import './styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid">
        {/* LOGO */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <i className="bi bi-shop me-2"></i> 
          El puesto de la dieta
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* BUSCADOR: mx-auto lo centra, search-form le da el ancho del CSS */}
          <form className="d-flex mx-auto search-form" role="search">
            <input className="form-control me-2" type="search" placeholder="Buscar productos" aria-label="Search" />
            <button className="btn btn-search" type="submit">Buscar</button>
          </form>

          {/* ICONOS: Usamos nav-icon-link para que el CSS los haga grandes y blancos */}
          <div className="navbar-icons d-flex">
            <a href="#" className="nav-icon-link">
              <i className="bi bi-person-circle"></i>
            </a>
            <a href="#" className="nav-icon-link">
              <i className="bi bi-cart3"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;