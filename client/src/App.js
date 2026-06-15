import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Clients from './pages/Clients';
import Commandes from './pages/Commandes';
import Stocks from './pages/Stocks';
import Paiements from './pages/Paiements';

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
      <div>
        <nav style={{ background: '#1e3a5f', padding: '10px 20px', display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', marginRight: 20 }}>Aksas Manager</span>
          <Link to="/clients" style={{ color: 'white', textDecoration: 'none' }}>Clients</Link>
          <Link to="/commandes" style={{ color: 'white', textDecoration: 'none' }}>Commandes</Link>
          <Link to="/stocks" style={{ color: 'white', textDecoration: 'none' }}>Stocks</Link>
          <Link to="/paiements" style={{ color: 'white', textDecoration: 'none' }}>Paiements</Link>
          <span style={{ marginLeft: 'auto', color: 'white' }}>
            {utilisateur.nom} —
            <button onClick={handleLogout} style={{ marginLeft: 10, background: 'transparent', color: 'white', border: '1px solid white', cursor: 'pointer', padding: '4px 8px' }}>
              Déconnexion
            </button>
          </span>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/clients" />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/paiements" element={<Paiements />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;