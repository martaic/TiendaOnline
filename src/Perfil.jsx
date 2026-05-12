import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './context/AuthContext';

function Perfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState({
    nombre: '',
    telefono: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    cp: '',
    tarjeta: '',
    avatar_url: 'bi-person-circle'
  });

  const iconos = ['bi-person-circle', 'bi-person-badge', 'bi-person-heart', 'bi-robot', 'bi-star-fill', 'bi-egg-fried'];

  useEffect(() => {
    if (user) getPerfil();
  }, [user]);

  async function getPerfil() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('perfiles') // <-- AQUÍ YA ESTABA BIEN
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setPerfil(data);
    } catch (error) {
      console.log('Cargando perfil nuevo...');
    } finally {
      setLoading(false);
    }
  }

  async function actualizarPerfil(e) {
    e.preventDefault();
    try {
      // CORRECCIÓN: Cambiado 'Perfiles' por 'perfiles'
      const { error } = await supabase
        .from('perfiles') 
        .upsert({ id: user.id, ...perfil });
        
      if (error) throw error;
      alert('¡Datos guardados correctamente!');
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  }

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 p-4">
            
            <div className="text-center mb-4">
              <i className={`bi ${perfil.avatar_url} display-2 text-success`}></i>
              <h2 className="fw-bold mt-2">Mi Cuenta</h2>
              <span className="badge bg-light text-dark border">{user?.email}</span>
            </div>

            <form onSubmit={actualizarPerfil}>
              {/* SECCIÓN ICONO */}
              <div className="mb-4 text-center">
                <label className="form-label d-block fw-bold">Elige tu avatar</label>
                <div className="d-flex gap-3 fs-3 justify-content-center bg-light p-3 rounded-pill">
                  {iconos.map(ico => (
                    <i 
                      key={ico} 
                      className={`bi ${ico} cursor-pointer ${perfil.avatar_url === ico ? 'text-success scale-125' : 'text-secondary opacity-50'}`}
                      style={{ cursor: 'pointer', transition: '0.2s' }}
                      onClick={() => setPerfil({...perfil, avatar_url: ico})}
                    ></i>
                  ))}
                </div>
              </div>

              {/* DATOS PERSONALES */}
              <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Datos Personales</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control" value={perfil.nombre || ''} 
                    onChange={e => setPerfil({...perfil, nombre: e.target.value})} placeholder="Juan Pérez" />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" className="form-control" value={perfil.telefono || ''} 
                    onChange={e => setPerfil({...perfil, telefono: e.target.value})} placeholder="600000000" />
                </div>
              </div>

              {/* DIRECCIÓN DESGLOSADA */}
              <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Dirección de Envío</h5>
              <div className="row g-3 mb-4">
                <div className="col-8">
                  <label className="form-label">Calle / Avenida</label>
                  <input type="text" className="form-control" value={perfil.calle || ''} 
                    onChange={e => setPerfil({...perfil, calle: e.target.value})} />
                </div>
                <div className="col-4">
                  <label className="form-label">Nº / Piso</label>
                  <input type="text" className="form-control" value={perfil.numero || ''} 
                    onChange={e => setPerfil({...perfil, numero: e.target.value})} />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Ciudad</label>
                  <input type="text" className="form-control" value={perfil.ciudad || ''} 
                    onChange={e => setPerfil({...perfil, ciudad: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia</label>
                  <input type="text" className="form-control" value={perfil.provincia || ''} 
                    onChange={e => setPerfil({...perfil, provincia: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">C.P.</label>
                  <input type="text" className="form-control" value={perfil.cp || ''} 
                    onChange={e => setPerfil({...perfil, cp: e.target.value})} />
                </div>
              </div>

              {/* PAGO */}
              <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Método de Pago</h5>
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-credit-card"></i></span>
                  <input type="text" className="form-control" placeholder="**** **** **** 1234" 
                    value={perfil.tarjeta || ''} 
                    onChange={e => setPerfil({...perfil, tarjeta: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm" style={{ backgroundColor: '#556b2f', borderColor: '#556b2f' }}>
                <i className="bi bi-save me-2"></i> Guardar toda la información
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;