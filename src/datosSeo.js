// ================= TÍTULOS Y DESCRIPCIONES DE CADA PÁGINA =================
// Se usan en dos sitios:
//  1. En la web, al entrar en cada página (hooks/useSeo.js).
//  2. Al publicar (scripts/prerender.mjs): se crea un HTML por página con su título,
//     descripción y vista previa para WhatsApp / Instagram / Facebook, y el sitemap.xml.
//
// ¡OJO! Si se añade una página nueva en App.jsx, hay que añadirla también aquí.
// Si no está en esta lista, al entrar directamente a su dirección saldrá la página 404.
//
// titulo:      lo que sale en la pestaña y en Google (se le añade " | El Puesto de la Dieta")
// descripcion: el texto de debajo del título en Google (unos 140-155 caracteres)
// noindex:     true en páginas que no deben salir en Google ni en el sitemap

export const PAGINAS = {
  '/': {
    descripcion:
      'Tienda online de El Puesto de la Dieta: aceitunas, gildas, encurtidos, especias, dulces, frutos secos y caramelos. Envío a toda la península en 24-48 h.',
  },
  '/aceitunas': {
    titulo: 'Aceitunas y encurtidos',
    descripcion:
      'Aceitunas aliñadas y encurtidos de El Puesto de la Dieta, directamente de nuestro puesto a tu mesa. Compra online con envío a la península en 24-48 h.',
  },
  '/gildas': {
    titulo: 'Gildas y mix de gildas',
    descripcion:
      'Gildas artesanas y mix de gildas: elige el tamaño o crea tu propio mix con 6 variedades. Envío a toda la península desde El Puesto de la Dieta.',
  },
  '/especias': {
    titulo: 'Especias',
    descripcion:
      'Especias, pimentón y condimentos de El Puesto de la Dieta para dar sabor a tu cocina. Compra online con envío a la península en 24-48 horas.',
  },
  '/dulces': {
    titulo: 'Dulces con y sin azúcar',
    descripcion:
      'Dulces y repostería tradicional, con y sin azúcar, de El Puesto de la Dieta. Compra online con envío a toda la España peninsular.',
  },
  '/frutos-secos': {
    titulo: 'Frutos secos',
    descripcion:
      'Frutos secos naturales y tostados de El Puesto de la Dieta, para picar o cocinar. Compra online con envío a la península en 24-48 horas.',
  },
  '/fruta-deshidratada': {
    titulo: 'Fruta deshidratada',
    descripcion:
      'Fruta deshidratada y liofilizada de El Puesto de la Dieta: todo el sabor de la fruta. Compra online con envío a la península en 24-48 horas.',
  },
  '/fritos': {
    titulo: 'Fritos y snacks',
    descripcion:
      'Fritos y snacks crujientes de El Puesto de la Dieta para el aperitivo. Compra online con envío a toda la España peninsular en 24-48 horas.',
  },
  '/conservas': {
    titulo: 'Conservas',
    descripcion:
      'Conservas seleccionadas de El Puesto de la Dieta. Compra online con envío a toda la España peninsular en 24-48 horas laborables.',
  },
  '/caramelos': {
    titulo: 'Caramelos',
    descripcion:
      'Caramelos de toda la vida, con muchos sabores para elegir. Compra online en El Puesto de la Dieta con envío a toda la península.',
  },
  '/miel': {
    titulo: 'Miel',
    descripcion:
      'Miel para tu despensa de El Puesto de la Dieta. Compra online con envío a toda la España peninsular en 24-48 horas laborables.',
  },
  '/sobre-nosotros': {
    titulo: 'Sobre nosotros',
    descripcion:
      'Conoce El Puesto de la Dieta, desde Jaraíz de la Vera (Cáceres): aceitunas, encurtidos, frutos secos y dulces de nuestro puesto, ahora también online.',
  },
  '/politica-envios': {
    titulo: 'Política de envíos',
    descripcion:
      'Envíos de El Puesto de la Dieta con TIPSA a toda la península por 6,90 €. Entrega en 24-48 horas laborables desde que sale tu pedido.',
  },
  '/preguntas-frecuentes': {
    titulo: 'Preguntas frecuentes',
    descripcion:
      'Resolvemos tus dudas sobre pedidos, formas de pago, envíos, alérgenos y devoluciones en la tienda online de El Puesto de la Dieta.',
  },
  '/contacto': {
    titulo: 'Contacto',
    descripcion:
      'Contacta con El Puesto de la Dieta por teléfono, WhatsApp o email. Te ayudamos con tus pedidos, envíos y cualquier duda sobre los productos.',
  },
  '/carrito': {
    titulo: 'Tu carrito',
    noindex: true,
  },
  '/buscar': {
    titulo: 'Buscar',
    noindex: true,
  },
};

// Datos de una página, con su ruta incluida (para el canonical)
export const seoDe = (ruta) => ({ ...PAGINAS[ruta], ruta });
