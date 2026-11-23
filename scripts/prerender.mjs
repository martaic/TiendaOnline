// ================= SE EJECUTA AL PUBLICAR (npm run build) =================
// La web se construye en el navegador, así que todas las páginas compartían el mismo HTML.
// Este script crea, a partir de dist/index.html, un HTML por página con su propio título,
// descripción, canonical y vista previa (WhatsApp, Instagram, Facebook...). También crea
// la página 404 y el sitemap.xml. Los datos salen de src/datosSeo.js.
import fs from 'node:fs';
import path from 'node:path';
import { PAGINAS } from '../src/datosSeo.js';

const DOMINIO = 'https://www.elpuestodeladieta.es';
const MARCA = 'El Puesto de la Dieta';
const dist = path.resolve('dist');
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const escapar = (t) =>
  String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Cambia el contenido de una etiqueta del <head> (o la añade si no existe)
function ponerMeta(html, regex, etiqueta) {
  return regex.test(html) ? html.replace(regex, etiqueta) : html.replace('</head>', `    ${etiqueta}\n  </head>`);
}

function construir({ titulo, descripcion, ruta, noindex }) {
  const tituloCompleto = titulo ? `${titulo} | ${MARCA}` : null;
  let html = base;
  if (tituloCompleto) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapar(tituloCompleto)}</title>`);
    html = ponerMeta(html, /<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${escapar(tituloCompleto)}" />`);
  }
  if (descripcion) {
    html = ponerMeta(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapar(descripcion)}" />`);
    html = ponerMeta(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapar(descripcion)}" />`);
  }
  if (ruta) {
    const url = DOMINIO + ruta;
    html = ponerMeta(html, /<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
    html = ponerMeta(html, /<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  }
  if (noindex) html = ponerMeta(html, /<meta\s+name="robots"[^>]*>/, '<meta name="robots" content="noindex" />');

  // Texto de respaldo para buscadores que no ejecutan JavaScript (React lo sustituye al cargar)
  if (titulo || descripcion) {
    // Va oculto a la vista (para que no se vea un instante al abrir la página),
    // pero los buscadores y lectores de pantalla lo siguen leyendo.
    const oculto = 'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';
    const respaldo = `<div style="${oculto}"><h1>${escapar(titulo || MARCA)}</h1>${descripcion ? `<p>${escapar(descripcion)}</p>` : ''}</div>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${respaldo}</div>`);
  }
  return html;
}

// 1. Un HTML por página: /gildas -> dist/gildas.html (Cloudflare lo sirve en /gildas)
for (const [ruta, datos] of Object.entries(PAGINAS)) {
  const archivo = ruta === '/' ? 'index.html' : `${ruta.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, archivo), construir({ ...datos, ruta }));
}

// 2. Página 404 (Cloudflare la muestra, con código 404, en cualquier dirección que no exista)
fs.writeFileSync(path.join(dist, '404.html'), construir({ titulo: 'Página no encontrada', noindex: true }));

// 3. sitemap.xml con las páginas que sí deben salir en Google
const urls = Object.entries(PAGINAS)
  .filter(([, datos]) => !datos.noindex)
  .map(([ruta]) => `  <url><loc>${DOMINIO}${ruta}</loc></url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`Prerender: ${Object.keys(PAGINAS).length} páginas, 404.html y sitemap.xml creados.`);