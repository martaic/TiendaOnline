import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './Home';
import Aceitunas from './Aceitunas';
import Dulces from './Dulces';
import Navbar from './Navbar';
import Footer from './Footer';
import Especias from './Especias';
import Gildas from './Gildas';
import Golosinas from './Golosinas';
import Carrito from './Carrito';
import Fritos from './Fritos';
import Envases from './Envases';
import SobreNosotros from './SobreNosotros';
import PoliticaEnvios from './PoliticaEnvios';
import Contacto from './Contacto';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aceitunas" element={<Aceitunas />} />
          <Route path="/dulces" element={<Dulces />} />
          <Route path="/especias" element={<Especias />} />
          <Route path="/fritos" element={<Fritos />} />
          <Route path="/envases" element={<Envases />} />
          <Route path="/gildas" element={<Gildas />} />
          <Route path="/golosinas" element={<Golosinas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/politica-envios" element={<PoliticaEnvios />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;