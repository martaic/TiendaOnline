import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './Home'; 
import Aceitunas from './Aceitunas'; 
import Dulces from './Dulces';
import Navbar from './Navbar';  
import Footer from './Footer';
import Encurtidos from './Encurtidos';
import Gildas from './Gildas';
import Golosinas from './Golosinas';
import Login from './Login';
import Registro from './Registro';
import Perfil from './Perfil'; 



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
<Route path="/encurtidos" element={<Encurtidos />} />
<Route path="/gildas" element={<Gildas />} />
<Route path="/golosinas" element={<Golosinas />} />
<Route path="/login" element={<Login />} />
<Route path="/registro" element={<Registro />} />
    <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;