import { useState } from 'react';
import api from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      const res = await api.post('/auth/login', { email, motDePasse });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('utilisateur', JSON.stringify(res.data.utilisateur));
      onLogin(res.data.utilisateur);
    } catch (err) {
      setErreur('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h2>Aksas Manager — Connexion</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Mot de passe</label><br />
          <input
            type="password"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
