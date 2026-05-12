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

  // Sustituye la línea de iconos por esta:
  const avataresDisponibles = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Dusty",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mario",
    "https://api.dicebear.com/7.x/big-smile/svg?seed=Bear",
    "https://api.dicebear.com/7.x/miniavs/svg?seed=Apple",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack"
  ];

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
      // 1. Creamos una copia para no ensuciar lo que el usuario ve mientras escribe
      let datosParaGuardar = { ...perfil };

      // 2. SEGURIDAD: Si la tarjeta es nueva (no tiene asteriscos aún), la enmascaramos
      if (datosParaGuardar.tarjeta && !datosParaGuardar.tarjeta.includes('*')) {
        const ultimosCuatro = datosParaGuardar.tarjeta.slice(-4);
        datosParaGuardar.tarjeta = `**** **** **** ${ultimosCuatro}`;
      }

      // 3. Guardamos en la base de datos
      const { error } = await supabase
        .from('perfiles')
        .upsert({ id: user.id, ...datosParaGuardar });

      if (error) throw error;

      // 4. Actualizamos el estado local para que el input muestre los asteriscos inmediatamente
      setPerfil(datosParaGuardar);
      alert('¡Datos guardados con éxito y tarjeta protegida!');
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
              <div className="text-center mb-4">
                {perfil.avatar_url.startsWith('http') ? (
                  <img src={perfil.avatar_url} alt="Avatar actual" className="rounded-circle shadow-sm border" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                ) : (
                  <i className={`bi ${perfil.avatar_url} display-2 text-success`}></i>
                )}
              </div>
              <h2 className="fw-bold mt-2">Mi Cuenta</h2>
              <span className="badge bg-light text-dark border">{user?.email}</span>
            </div>

            <form onSubmit={actualizarPerfil}>
              {/* SECCIÓN ICONO */}
              {/* SECCIÓN AVATAR MEJORADA */}
              <div className="mb-4 text-center">
                <label className="form-label d-block fw-bold">Elige tu avatar</label>
                <div className="d-flex flex-wrap gap-3 justify-content-center bg-light p-3 rounded shadow-sm">
                  {avataresDisponibles.map(url => (
                    <img
                      key={url}
                      src={url}
                      alt="avatar"
                      className={`rounded-circle border ${perfil.avatar_url === url ? 'border-success border-3 scale-110' : 'opacity-75'}`}
                      style={{ width: '50px', height: '50px', cursor: 'pointer', transition: '0.2s' }}
                      onClick={() => setPerfil({ ...perfil, avatar_url: url })}
                    />
                  ))}
                </div>
              </div>

              {/* DATOS PERSONALES */}
              <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Datos Personales</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control" value={perfil.nombre || ''}
                    onChange={e => setPerfil({ ...perfil, nombre: e.target.value })} placeholder="Nombre Apellidos" />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" className="form-control" value={perfil.telefono || ''}
                    onChange={e => setPerfil({ ...perfil, telefono: e.target.value })} placeholder="Numero de telefono" />
                </div>
              </div>

              {/* DIRECCIÓN DESGLOSADA */}
              <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Dirección de Envío</h5>
              <div className="row g-3 mb-4">
                <div className="col-8">
                  <label className="form-label">Calle / Avenida</label>
                  <input type="text" className="form-control" value={perfil.calle || ''}
                    onChange={e => setPerfil({ ...perfil, calle: e.target.value })} />
                </div>
                <div className="col-4">
                  <label className="form-label">Nº / Piso</label>
                  <input type="text" className="form-control" value={perfil.numero || ''}
                    onChange={e => setPerfil({ ...perfil, numero: e.target.value })} />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Ciudad</label>
                  <input type="text" className="form-control" value={perfil.ciudad || ''}
                    onChange={e => setPerfil({ ...perfil, ciudad: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia</label>
                  <input type="text" className="form-control" value={perfil.provincia || ''}
                    onChange={e => setPerfil({ ...perfil, provincia: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">C.P.</label>
                  <input type="text" className="form-control" value={perfil.cp || ''}
                    onChange={e => setPerfil({ ...perfil, cp: e.target.value })} />
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