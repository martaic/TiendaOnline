import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Importamos la conexión
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Usamos la función oficial de Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Si todo va bien, el AuthContext detectará la sesión solo
      alert("¡Bienvenido de nuevo!");
      navigate('/'); // Redirigir al inicio
      
    } catch (err) {
      setError("Email o contraseña incorrectos");
      console.error("Error en login:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow border-0 p-4 mt-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#198754' }}>Iniciar Sesión</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold py-2"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-3 small">
          ¿Aún no tienes cuenta? <Link to="/registro" className="text-success fw-bold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;