import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Conexión
import { useCart } from './context/CartContext'; // Carrito

function Home() {
  const [destacados, setDestacados] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function cargarHome() {
      // 1. Traemos productos destacados (por ejemplo, los que tienen stock alto o IDs específicos)
      const { data: dataDestacados } = await supabase
        .from('Productos')
        .select('*')
        .limit(6); // Traemos los 6 primeros para el slider

      // 2. Traemos ofertas (en una tienda real filtrarías por una columna 'oferta', 
      // aquí simularemos trayendo otros 6)
      const { data: dataOfertas } = await supabase
        .from('Productos')
        .select('*')
        .range(7, 12); 

      setDestacados(dataDestacados || []);
      setOfertas(dataOfertas || []);
    }
    cargarHome();
  }, []);

  return (
    <div className="container-home">
      {/* 1. Pestañas de categorías */}
      <div className="pestañas py-2 bg-light shadow-sm">
        <ul className="nav justify-content-center">
          <li className="nav-item"><Link className="nav-link text-success fw-bold" to="/aceitunas">Aceitunas</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/gildas">Gildas</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/encurtidos">Encurtidos</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/dulces">Dulces</Link></li>
          <li className="nav-item"><Link className="nav-link text-dark" to="/golosinas">Golosinas</Link></li>
        </ul>
      </div>

      {/* 2. Carrusel (se mantiene igual) */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade shadow-sm" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://imgs.search.brave.com/o4049vC_ynZkvRaP5eQzYB88Tq5GyEk2Rt0otjJ-xOQ/rs:fit:860:0:0:0/g:ce/aHR0cDovL2FjZWl0/dW5hc2dvbnphbGV6/LmVzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDE5LzA2L2NhbXBv/LXJlYWwtYWNlaXR1/bmFzLnBuZw" className="d-block w-100" alt="aceitunas" style={{ height: '400px', objectFit: 'cover' }} />
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
{/* 3. Sección Productos Destacados DINÁMICA */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">Productos destacados</h1>
          <span className="text-muted d-none d-md-inline">Desliza para ver más →</span>
        </div>

        <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
          {destacados.map((item) => (
            <div className="card product-card flex-shrink-0" style={{ width: '250px' }} key={item.id}>
              <img src={item.imagen_url} className="card-img-top" alt={item.nombre} style={{ height: '180px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fs-6 fw-bold">{item.nombre}</h5>
                <p className="card-text text-success fw-bold">{item.precio}€</p>
                <button 
                  className="btn btn-success w-100 mt-auto"
                  onClick={() => addToCart(item)}
                >
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sección Ofertas DINÁMICA */}
      <div className="container py-5 bg-light rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <h1 className="section-title mb-0 text-danger">Ofertas Hot 🔥</h1>
        </div>

        <div className="slider-productos d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: '15px' }}>
          {ofertas.map((item) => (
            <div className="card product-card border-warning flex-shrink-0" style={{ width: '250px' }} key={item.id}>
              <div className="badge bg-danger position-absolute m-2">OFERTA</div>
              <img src={item.imagen_url} className="card-img-top" alt={item.nombre} style={{ height: '180px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fs-6 fw-bold">{item.nombre}</h5>
                <p className="card-text text-muted small text-decoration-line-through">{(item.precio * 1.2).toFixed(2)}€</p>
                <p className="card-text text-danger fw-bold">{item.precio}€</p>
                <button 
                  className="btn btn-outline-danger w-100 mt-auto"
                  onClick={() => addToCart(item)}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;