import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './Home';
import Aceitunas from './Aceitunas';
import Dulces from './Dulces';
import Navbar from './Navbar';
import Footer from './Footer';
import Especias from './Especias';
import Gildas from './Gildas';
import Golosinas from './Golosinas';
import Login from './Login';
import Registro from './Registro';
import Perfil from './Perfil';
import Carrito from './Carrito';
import Checkout from './Checkout';
import Pedidos from './Pedidos';
import Fritos from './Fritos';
import SobreNosotros from './SobreNosotros';
import PoliticaEnvios from './PoliticaEnvios';
import Contacto from './Contacto';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aceitunas" element={<Aceitunas />} />
            <Route path="/dulces" element={<Dulces />} />
            <Route path="/especias" element={<Especias />} />
            <Route path="/fritos" element={<Fritos />} />
            <Route path="/gildas" element={<Gildas />} />
            <Route path="/golosinas" element={<Golosinas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/politica-envios" element={<PoliticaEnvios />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;