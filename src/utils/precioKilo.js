// ================= PRECIO POR KILO =================
// Saca el peso de un texto como "500 gr", "1 Kg", "1,5 kg", "250g"... y calcula el precio por kilo.
// Si no encuentra un peso (p. ej. "Default Title" o "2 unidades"), devuelve null y no se muestra nada.

const formatoEuro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

function pesoEnKilos(texto = '') {
  const m = String(texto).match(/(\d+(?:[.,]\d+)?)\s*(kg|kgs|kilos?|gr|grs|g|gramos)\b/i);
  if (!m) return null;
  const numero = parseFloat(m[1].replace(',', '.'));
  if (!numero) return null;
  const unidad = m[2].toLowerCase();
  return unidad.startsWith('k') ? numero : numero / 1000;
}

// precio: número o texto ("5.50"); textos: dónde buscar el peso (título de la variante, nombre del producto...)
export function precioPorKilo(precio, ...textos) {
  const euros = Number(precio);
  if (!euros) return null;
  for (const texto of textos) {
    if (!texto || texto === 'Default Title') continue;
    const kilos = pesoEnKilos(texto);
    if (kilos) return `${formatoEuro.format(euros / kilos)}/kg`;
  }
  return null;
}
