import { useEffect } from 'react';

// ===== DATOS DE CONTACTO (cámbialos solo aquí) =====
const TELEFONO = '633 683 722';
const WHATSAPP = '34633683722'; // con prefijo de España y sin espacios. Déjalo vacío ('') si no usáis WhatsApp
const EMAIL = ''; // ← cuando creéis el correo, ponlo aquí: 'info@elpuestodeladieta.es'
const DIRECCION = 'Calle Bobadilla, 2';
const LOCALIDAD = 'Jaraíz de la Vera (Cáceres)';

const telefonoEnlace = `+34${TELEFONO.replace(/\s/g, '')}`;

function Contacto() {
  useEffect(() => {
    document.title = 'Contacto | El Puesto de la Dieta';
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <h1 className="fw-bold text-success mb-3">Contacto</h1>
      <p className="lead text-muted mb-4">
        Si tienes cualquier duda, estaremos encantados de ayudarte.
      </p>

      <div className="card shadow-sm border-0 p-4">
        {/* Teléfono */}
        <div className="d-flex align-items-start gap-3 mb-4">
          <i className="bi bi-telephone-fill fs-4 text-success"></i>
          <div>
            <h2 className="fs-6 fw-bold mb-1">Teléfono</h2>
            <a href={`tel:${telefonoEnlace}`} className="text-decoration-none fs-5">
              {TELEFONO}
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        {WHATSAPP && (
          <div className="d-flex align-items-start gap-3 mb-4">
            <i className="bi bi-whatsapp fs-4 text-success"></i>
            <div>
              <h2 className="fs-6 fw-bold mb-1">WhatsApp</h2>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-sm rounded-pill px-3"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Email (solo se muestra cuando exista) */}
        {EMAIL && (
          <div className="d-flex align-items-start gap-3 mb-4">
            <i className="bi bi-envelope-fill fs-4 text-success"></i>
            <div>
              <h2 className="fs-6 fw-bold mb-1">Email</h2>
              <a href={`mailto:${EMAIL}`} className="text-decoration-none">
                {EMAIL}
              </a>
            </div>
          </div>
        )}

        {/* Dirección */}
        <div className="d-flex align-items-start gap-3">
          <i className="bi bi-geo-alt-fill fs-4 text-success"></i>
          <div>
            <h2 className="fs-6 fw-bold mb-1">Dirección</h2>
            <address className="mb-1">
              {DIRECCION}
              <br />
              {LOCALIDAD}
            </address>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;