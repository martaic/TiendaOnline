// ================= DATOS DE ENVÍO =================
// Si cambia algo del envío, cámbialo SOLO aquí: lo usan el carrito, la política de envíos,
// las preguntas frecuentes y los pasos del pedido.
// Recuerda que el precio también hay que cambiarlo en Shopify (Configuración → Envío y entrega).

export const TRANSPORTISTA = 'TIPSA';

// Precio del envío en euros (número, con punto decimal)
export const COSTE_ENVIO = 6.9;
export const COSTE_ENVIO_TEXTO = '6,90 €';

// Días en los que salen los pedidos del almacén
export const DIAS_ENVIO = 'lunes, martes y miércoles';

// Hora a la que TIPSA pasa a recoger los pedidos los días de envío
export const HORA_RECOGIDA = '18:30';

// Los pedidos hechos a partir de este día se envían la semana siguiente
export const DIA_CORTE = 'miércoles';

// Lo que tarda TIPSA desde que el pedido sale del almacén
export const PLAZO = '24-48 horas';
// ================= RECOGIDA EN MERCADO =================
// Mercados donde el cliente puede recoger su pedido (gratis).
// El cliente lo elige en la página de pago de Shopify: allí tiene que haber UNA TARIFA DE 0 €
// POR CADA MERCADO, con el nombre que da nombreTarifa() (p. ej. "Recogida – Martes · Plasencia (9:00 a 13:00)").
// Si añades, quitas o cambias un mercado aquí, haz lo mismo con su tarifa en Shopify
// (Configuración → Envío y entrega).
export const MERCADOS = [
  { dia: 'Lunes', lugar: 'Candeleda', horario: '9:00 a 13:00' },
  { dia: 'Martes', lugar: 'Plasencia', horario: '9:00 a 13:00' },
  { dia: 'Miércoles', lugar: 'Talavera de la Reina', horario: '9:00 a 13:00' },
  { dia: 'Miércoles', lugar: 'Arenas de San Pedro', horario: '9:00 a 13:00' },
  { dia: 'Jueves', lugar: 'Trujillo', horario: '9:00 a 13:00' },
  { dia: 'Jueves', lugar: 'Jaraíz de la Vera', horario: '9:00 a 13:00' },
  { dia: 'Viernes', lugar: 'Plasencia', horario: '9:00 a 13:00' },
  { dia: 'Viernes', lugar: 'Navalmoral de la Mata', horario: '9:00 a 13:00' },
];

// Texto de un mercado, p. ej. "Martes · Plasencia (9:00 a 13:00)"
export const textoMercado = (m) => `${m.dia} · ${m.lugar} (${m.horario})`;

// Nombre que tiene la tarifa de cada mercado en Shopify
export const nombreTarifa = (m) => `Recogida – ${textoMercado(m)}`;
