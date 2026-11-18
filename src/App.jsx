import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './Home';
import Aceitunas from './Aceitunas';
import Dulces from './Dulces';
import Navbar from './Navbar';
import BarraCategorias from './components/BarraCategorias';
import BarraAvisos from './BarraAvisos';
import Footer from './Footer';
import Especias from './Especias';
import Gildas from './Gildas';
import Golosinas from './Golosinas';
import Carrito from './Carrito';
import Fritos from './Fritos';
import Conservas from './Conservas';
import Caramelos from './Caramelos';
import Miel from './Miel';
import FrutaDeshidratada from './FrutaDeshidratada';
import SobreNosotros from './SobreNosotros';
import PoliticaEnvios from './PoliticaEnvios';
import Contacto from './Contacto';
import Buscar from './Buscar';
import PaginaNoEncontrada from './PaginaNoEncontrada';
import PaginaPreguntas from './PaginaPreguntas';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Enlace oculto para saltar directamente al contenido (teclado y lectores de pantalla) */}
        <a href="#contenido" className="visually-hidden-focusable btn btn-light position-absolute m-2" style={{ zIndex: 2000 }}>
          Saltar al contenido
        </a>
        <BarraAvisos />
        <header>
          <Navbar />
          <BarraCategorias />
        </header>
        <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aceitunas" element={<Aceitunas />} />
          <Route path="/dulces" element={<Dulces />} />
          <Route path="/especias" element={<Especias />} />
          <Route path="/fritos" element={<Fritos />} />
          <Route path="/conservas" element={<Conservas />} />
          {/* Dirección antigua: lleva a la nueva */}
          <Route path="/envases" element={<Navigate to="/conservas" replace />} />
          <Route path="/caramelos" element={<Caramelos />} />
          <Route path="/miel" element={<Miel />} />
          <Route path="/fruta-deshidratada" element={<FrutaDeshidratada />} />
          <Route path="/gildas" element={<Gildas />} />
          <Route path="/golosinas" element={<Golosinas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/politica-envios" element={<PoliticaEnvios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/preguntas-frecuentes" element={<PaginaPreguntas />} />
          {/* Cualquier otra dirección: página de error 404 */}
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;