import { useEffect, useState } from 'react';
import { precioPorKilo } from '../utils/precioKilo';

// Formatea precios al estilo español: 3,50 €
const formatoEuro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const formatearPrecio = (valor) => formatoEuro.format(Number(valor || 0));

// ================= FICHA DEL PRODUCTO (ventana emergente) =================
// La usan todas las secciones. Muestra foto, precio, tamaño, ingredientes y botón de compra.
//
// producto:       el producto de Shopify (nombre, imagen, descripción, variantes)
// onClose:        cerrar la ventana
// onAdd:          añadir al carrito (el addToCart de la sección)
// color:          'success' (verde) o 'danger' (rojo), según la sección
// tituloInfo:     título del apartado de texto (por defecto "Ingredientes y alérgenos:")
// textoInfo:      texto a mostrar si el producto no tiene descripción en Shopify
// permitirCompra: false para ocultar el botón (p. ej. el mix a tu gusto, que se elige en su tarjeta)
// aviso:          texto opcional que sale en lugar del botón cuando no se permite la compra
function ModalProducto({
  producto,
  onClose,
  onAdd,
  color = 'success',
  tituloInfo = 'Ingredientes y alérgenos:',
  textoInfo = '',
  permitirCompra = true,
  aviso = '',
}) {
  const variantes = producto.variantes || [];
  const [varianteId, setVarianteId] = useState(
    () => (variantes.find((v) => v.availableForSale !== false) || variantes[0])?.id
  );
  const [anadido, setAnadido] = useState(false);

  // Cerrar con la tecla Escape y bloquear el scroll de fondo mientras está abierta
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onClose]);

  const varianteActual = variantes.find((v) => v.id === varianteId) || variantes[0];
  const tieneVariasOpciones = variantes.length > 1;
  const cantidad =
    varianteActual && !tieneVariasOpciones && varianteActual.title !== 'Default Title'
      ? varianteActual.title
      : null;
  const agotado = !varianteActual || varianteActual.availableForSale === false;
  const texto = producto.descripcion || textoInfo;

  const handleAdd = () => {
    if (!varianteActual || !onAdd) return;
    onAdd({
      id: varianteActual.id,
      title:
        tieneVariasOpciones || cantidad
          ? `${producto.nombre} (${varianteActual.title})`
          : producto.nombre,
      price: Number(varianteActual.price?.amount || 0),
      image: producto.imagen_url,
    });
    setAnadido(true);
    setTimeout(() => setAnadido(false), 1500);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-producto-titulo"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
      onClick={onClose} // Cierra al pulsar fuera
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          <div className={`modal-header bg-${color} text-white`}>
            <h2 id="modal-producto-titulo" className="modal-title fw-bold fs-5">
              {producto.nombre}
            </h2>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onClose}
              autoFocus
            ></button>
          </div>

          <div className="modal-body p-4">
            {producto.imagen_url && (
              <img
                src={producto.imagen_url}
                alt={producto.imagen_alt || producto.nombre}
                className="img-fluid rounded mb-3 shadow-sm"
                style={{ maxHeight: '260px', width: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Precio y tamaño */}
            {varianteActual && (
              <div className="text-center mb-3">
                <p className={`fs-3 fw-bold text-${color} mb-0`}>
                  {formatearPrecio(varianteActual.price?.amount)}
                  {cantidad && <span className="fs-6 fw-normal text-muted"> · {cantidad}</span>}
                </p>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                  IVA incluido
                  {precioPorKilo(varianteActual.price?.amount, varianteActual.title, producto.nombre) &&
                    ` · ${precioPorKilo(varianteActual.price?.amount, varianteActual.title, producto.nombre)}`}
                </span>
              </div>
            )}

            {tieneVariasOpciones && (
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="modal-variante">
                  Selecciona cantidad
                </label>
                <select
                  id="modal-variante"
                  className="form-select"
                  value={varianteActual.id}
                  onChange={(e) => setVarianteId(e.target.value)}
                >
                  {variantes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} · {formatearPrecio(v.price?.amount)}
                      {v.availableForSale === false ? ' (agotado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ingredientes y alérgenos (o el texto que toque). Si no hay nada, no se muestra */}
            {texto && (
              <div className="mt-3">
                <h3 className={`fw-bold text-${color} fs-6`}>{tituloInfo}</h3>
                <p
                  className="text-muted bg-light p-3 rounded mb-0"
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                >
                  {texto}
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 p-3 d-flex flex-column gap-2">
            {permitirCompra ? (
              <button
                type="button"
                className={`btn btn-${color} w-100 py-2 fw-bold`}
                onClick={handleAdd}
                disabled={agotado}
                aria-label={`Añadir ${producto.nombre} al carrito`}
              >
                {agotado ? 'Agotado' : anadido ? '✓ Añadido' : 'Añadir al carrito'}
              </button>
            ) : (
              aviso && <p className="small text-muted text-center w-100 mb-0">{aviso}</p>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary w-100 py-2"
              onClick={onClose}
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProducto;
