import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Home.css';

// Pestañas de categorías (para añadir o cambiar una, tócala solo aquí)
// "icono" puede ser un dibujo de la carpeta public/iconos/ o un emoji
const CATEGORIAS = [
  { nombre: 'Encurtidos', ruta: '/aceitunas', icono: '/iconos/encurtidos.png' },
  { nombre: 'Gildas', ruta: '/gildas', icono: '/iconos/gildas.png' },
  { nombre: 'Especias', ruta: '/especias', icono: '/iconos/especias.png' },
  { nombre: 'Dulces', ruta: '/dulces', icono: '/iconos/dulces.png' },
  { nombre: 'Frutos secos', ruta: '/frutos-secos', icono: '/iconos/frutos-secos.png' },
  { nombre: 'Fruta deshidratada', ruta: '/fruta-deshidratada', icono: '/iconos/fruta-deshidratada.png' },
  { nombre: 'Fritos', ruta: '/fritos', icono: '/iconos/fritos.png' },
  { nombre: 'Conservas', ruta: '/conservas', icono: '/iconos/envases.png' },
  { nombre: 'Caramelos', ruta: '/caramelos', icono: '/iconos/caramelos.png' },
  { nombre: 'Miel', ruta: '/miel', icono: '/iconos/miel.png' },
];

// Barra de categorías: sale en todas las páginas, debajo de la cabecera.
// Se desliza con el dedo o el ratón, con flechas cuando no caben todas,
// y la pestaña de la sección en la que estás sale marcada.
function BarraCategorias() {
  const listaRef = useRef(null);
  const [flechas, setFlechas] = useState({ izquierda: false, derecha: false });

  // Comprueba si hay más pestañas escondidas a cada lado
  const actualizarFlechas = useCallback(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const { scrollLeft, scrollWidth, clientWidth } = lista;
    setFlechas({
      izquierda: scrollLeft > 4,
      derecha: scrollLeft + clientWidth < scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    actualizarFlechas();
    window.addEventListener('resize', actualizarFlechas);
    return () => window.removeEventListener('resize', actualizarFlechas);
  }, [actualizarFlechas]);

  // Al cambiar de sección, desliza la barra para que se vea la pestaña marcada (útil en el móvil)
  const { pathname } = useLocation();
  useEffect(() => {
    const activa = listaRef.current?.querySelector('.categoria-pill.active');
    activa?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [pathname]);

  const desplazar = (direccion) => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollBy({ left: direccion * lista.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <nav className="categorias" aria-label="Categorías">
      <div className="categorias-contenedor">
        {flechas.izquierda && (
          <button
            type="button"
            className="categorias-flecha categorias-flecha-izq"
            onClick={() => desplazar(-1)}
            aria-label="Ver categorías anteriores"
          >
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
        )}

        <ul className="categorias-lista" ref={listaRef} onScroll={actualizarFlechas}>
          {CATEGORIAS.map((cat) => (
            <li key={cat.ruta}>
              <NavLink className="categoria-pill" to={cat.ruta}>
                <span className="categoria-icono" aria-hidden="true">
                  {cat.icono.startsWith('/') ? (
                    <img src={cat.icono} alt="" width="24" height="24" onLoad={actualizarFlechas} />
                  ) : (
                    cat.icono
                  )}
                </span>
                {cat.nombre}
              </NavLink>
            </li>
          ))}
        </ul>

        {flechas.derecha && (
          <button
            type="button"
            className="categorias-flecha categorias-flecha-der"
            onClick={() => desplazar(1)}
            aria-label="Ver más categorías"
          >
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </nav>
  );
}

export default BarraCategorias;
