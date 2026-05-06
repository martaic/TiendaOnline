import React from 'react';
import './styles/Home.css';

function Home() {
  return (
    <div className="container-home">
      {/* 1. Pestañas de categorías - Sin margen superior para pegar al Navbar */}
      <div className="pestañas py-2 bg-light shadow-sm">
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a className="nav-link text-success fw-bold" href="#">Aceitunas</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="#">Gildas</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="#">Encurtidos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="#">Dulces</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark" href="#">Golosinas</a>
          </li>
        </ul>
      </div>
      
      {/* 2. Carrusel de fotos - Separado de las pestañas por el margen en CSS */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade shadow-sm" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src="https://imgs.search.brave.com/o4049vC_ynZkvRaP5eQzYB88Tq5GyEk2Rt0otjJ-xOQ/rs:fit:860:0:0:0/g:ce/aHR0cDovL2FjZWl0/dW5hc2dvbnphbGV6/LmVzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE5LzA2L2NhbXBv/LXJlYWwtYWNlaXR1/bmFzLnBuZw" 
              className="d-block w-100" 
              alt="aceitunas"
              style={{ height: '400px', objectFit: 'cover' }} 
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://imgs.search.brave.com/QWW7rWeqhvx-o46SdthNoUN6apIcDNC9Use8GM0k4k4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWh1bWFkb3Nkb21p/bmd1ZXouZXMvd3At/Y29udGVudC91cGxv/YWRzLzIwMjUvMTAv/R2lsZGFzLWNhc2Vy/YXMtYW5jaG9hLWJv/cXVlcm9uLnBuZy53/ZWJw" 
              className="d-block w-100" 
              alt="gildas"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
          <div className="carousel-item">
            <img 
              src="https://imgs.search.brave.com/QBPEp5gElmydEvxB7L2ZmvZsomN_QjDmOkC5x1Y5yoI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ob3N0/ZWxlcmlhZW56YW1v/cmEuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE5LzA1L0lN/Ry0yMDE5MDUwOS1X/QTAwMDYtODAweDQ0/NS5qcGc" 
              className="d-block w-100" 
              alt="roscas"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

     {/* 3. Sección Productos Destacados con Scroll Horizontal */}
<div className="container py-5">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h1 className="section-title mb-0">Productos destacados</h1>
    <span className="text-muted d-none d-md-inline">Desliza para ver más →</span>
  </div>

  {/* Contenedor con scroll */}
  <div className="slider-productos">
    
    <div className="card product-card">
      <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
      <div className="card-body">
        <h5 className="card-title">Aceitunas Chupadedos</h5>
        <p className="card-text">1kg - 2.50€/kg</p>
        <button className="btn btn-success w-100 mt-auto">Añadir</button>
      </div>
    </div>

    <div className="card product-card">
      <img src="https://salazonarte.com/93-large_default/aceitunas-partidas-malaguenas-alorenas.jpg" className="card-img-top" alt="Partidas" />
      <div className="card-body">
        <h5 className="card-title">Aceitunas partidas</h5>
        <p className="card-text">1kg - 2.50€/kg</p>
        <button className="btn btn-success w-100 mt-auto">Añadir</button>
      </div>
    </div>

          <div className="card product-card">
            <img src="https://salazonarte.com/64-large_default/altramuces.jpg" className="card-img-top" alt="Altramuces" />
            <div className="card-body">
              <h5 className="card-title">Altramuces</h5>
              <p className="card-text">1kg - 2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
          </div>

          <div className="card product-card">
            <img src="https://salazonarte.com/482-large_default/berenjenas-de-almagro.jpg" className="card-img-top" alt="Berenjenas" />
            <div className="card-body">
              <h5 className="card-title">Berenjenas Almagro</h5>
              <p className="card-text">1kg - 2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
          </div>
          
          <div className="card product-card">
            <img src="https://salazonarte.com/94-large_default/cucumber.jpg" className="card-img-top" alt="Pepinillos" />
            <div className="card-body">
              <h5 className="card-title">Pepinillos</h5>
              <p className="card-text">1kg - 2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
          </div>

          <div className="card product-card">
            <img src="https://salazonarte.com/87-large_default/aceitunas-manzanilla-sabor-anchoa.jpg" className="card-img-top" alt="Manzanilla" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Manzanilla</h5>
              <p className="card-text">1kg - 2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>

           {/* Ofertas */}
<div className="container py-5">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h1 className="section-title mb-0">Ofertas</h1>
    <span className="text-muted d-none d-md-inline">Desliza para ver más →</span>
  </div>

  {/* Contenedor con scroll */}
  <div className="slider-productos">
           {/* Repetimos estructura de cards para ofertas */}
           <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>
          <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>
          <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>
          <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>
          <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>
          <div className="card product-card border-warning shadow-sm">
             <div className="badge bg-danger position-absolute m-2">OFERTA</div>
            <img src="https://imgs.search.brave.com/-ukr0QSK_U0gjgVqZmP1cEEGbaSevi2lYCxg_MID5n0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZGlz/aG9zLmVzLzIwOTgt/bGFyZ2VfZGVmYXVs/dC9hY2VpdHVuYXMt/Y2h1cGFkZWRvcy01/LWtnLXBhc3Rvci1j/dWJvLmpwZw" className="card-img-top" alt="Chupadedos" />
            <div className="card-body">
              <h5 className="card-title">Aceitunas Chupadedos</h5>
              <p className="card-text text-decoration-line-through text-muted small">3.50€/kg</p>
              <p className="card-text fw-bold text-danger">2.50€/kg</p>
              <button className="btn btn-success w-100 mt-auto">Añadir al carrito</button>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;