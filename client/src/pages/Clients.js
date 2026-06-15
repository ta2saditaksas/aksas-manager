import { useState, useEffect } from 'react';
import api from '../api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [erreur, setErreur] = useState('');

  const fetchClients = async () => {
    const res = await api.get('/clients');
    setClients(res.data);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/clients', { nom, prenom, telephone, email });
      setNom(''); setPrenom(''); setTelephone(''); setEmail('');
      fetchClients();
    } catch (err) {
      setErreur('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce client ?')) {
      await api.delete(`/clients/${id}`);
      fetchClients();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Nom *" value={nom} onChange={e => setNom(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Nom</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Prénom</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Téléphone</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Email</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: 10 }}>{c.nom}</td>
              <td style={{ padding: 10 }}>{c.prenom}</td>
              <td style={{ padding: 10 }}>{c.telephone}</td>
              <td style={{ padding: 10 }}>{c.email}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;