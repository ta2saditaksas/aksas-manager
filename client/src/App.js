import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Commandes from './pages/Commandes';
import CommandeDetail from './pages/CommandeDetail';
import Devis from './pages/Devis';
import Livraisons from './pages/Livraisons';

function App() {
  const [utilisateur, setUtilisateur] = useState(
    JSON.parse(localStorage.getItem('utilisateur')) || null
  );

  const handleLogin = (user) => setUtilisateur(user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
  };

  if (!utilisateur) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
        <Navbar utilisateur={utilisateur} onLogout={handleLogout} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/commandes/:id" element={<CommandeDetail />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/livraisons" element={<Livraisons />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;