import { useEffect } from 'react';

const DOMINIO = 'https://www.elpuestodeladieta.es';
const MARCA = 'El Puesto de la Dieta';

// Crea (si no existe) y rellena una etiqueta <meta> o <link> del <head>
function ponerEtiqueta(selector, crear, atributo, valor) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = crear();
    document.head.appendChild(el);
  }
  el.setAttribute(atributo, valor);
  return el;
}

const meta = (clave, nombre) => () => {
  const el = document.createElement('meta');
  el.setAttribute(clave, nombre);
  return el;
};

// ================= TÍTULO, DESCRIPCIÓN Y CANONICAL DE CADA PÁGINA =================
// titulo:      lo que sale en la pestaña y en Google (se le añade " | El Puesto de la Dieta")
// descripcion: el texto de debajo del título en Google (unos 140-155 caracteres)
// ruta:        la dirección de la página, p. ej. '/gildas' (para el canonical)
// noindex:     true en páginas que no deben salir en Google (carrito, buscador...)
export default function useSeo({ titulo, descripcion, ruta, noindex = false }) {
  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | ${MARCA}` : `${MARCA} | Aceitunas, gildas, encurtidos y frutos secos`;
    document.title = tituloCompleto;

    if (descripcion) {
      ponerEtiqueta('meta[name="description"]', meta('name', 'description'), 'content', descripcion);
      ponerEtiqueta('meta[property="og:description"]', meta('property', 'og:description'), 'content', descripcion);
    }
    ponerEtiqueta('meta[property="og:title"]', meta('property', 'og:title'), 'content', tituloCompleto);

    // Sin ruta (p. ej. la página 404) quitamos el canonical de la página anterior
    if (!ruta) document.head.querySelector('link[rel="canonical"]')?.remove();

    if (ruta) {
      const url = DOMINIO + ruta;
      ponerEtiqueta(
        'link[rel="canonical"]',
        () => {
          const el = document.createElement('link');
          el.setAttribute('rel', 'canonical');
          return el;
        },
        'href',
        url
      );
      ponerEtiqueta('meta[property="og:url"]', meta('property', 'og:url'), 'content', url);
    }

    // Páginas que no deben aparecer en Google
    let robots = null;
    if (noindex) {
      robots = ponerEtiqueta('meta[name="robots"]', meta('name', 'robots'), 'content', 'noindex');
    }
    return () => {
      if (robots) robots.remove();
    };
  }, [titulo, descripcion, ruta, noindex]);
}
