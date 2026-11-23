// ================= PESO NETO Y ESCURRIDO =================
// Busca en la descripción de Shopify frases como
//   "Peso neto 120 g Peso escurrido 55 g"  o  "Peso neto: 120 g. Peso neto escurrido: 55 g"
// y devuelve un texto corto para la tarjeta: "Peso neto 120 g · Escurrido 55 g".
// Si la descripción no tiene pesos, devuelve null y no se muestra nada.

const CANTIDAD = String.raw`(\d+(?:[.,]\d+)?)\s*(kg|kgs|kilos?|gr|grs|gramos|g|ml|cl|l)\b`;

const RE_ESCURRIDO = new RegExp(String.raw`peso\s+(?:neto\s+)?escurrido\s*:?\s*` + CANTIDAD, 'i');
const RE_NETO = new RegExp(String.raw`peso\s+neto(?!\s+escurrido)\s*:?\s*` + CANTIDAD, 'i');

function leer(texto, re) {
  const m = texto.match(re);
  if (!m) return null;
  let unidad = m[2].toLowerCase();
  if (['gr', 'grs', 'gramos'].includes(unidad)) unidad = 'g';
  if (['kgs', 'kilo', 'kilos'].includes(unidad)) unidad = 'kg';
  return `${m[1].replace('.', ',')} ${unidad}`;
}

export function pesosConserva(descripcion = '') {
  const texto = String(descripcion || '');
  const neto = leer(texto, RE_NETO);
  const escurrido = leer(texto, RE_ESCURRIDO);
  if (!neto && !escurrido) return null;
    return [neto && `Peso neto ${neto}`, escurrido && `Peso escurrido ${escurrido}`]
    .filter(Boolean)
    .join(' · ');
}
