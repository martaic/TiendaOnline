import './styles/App.css';
import Navbar from './Navbar';
import Home from './Home';
import Footer from './Footer';

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;