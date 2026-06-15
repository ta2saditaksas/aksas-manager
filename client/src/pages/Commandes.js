import { useState, useEffect } from 'react';
import api from '../api';

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [reference, setReference] = useState('');
  const [clientId, setClientId] = useState('');
  const [statut, setStatut] = useState('en_attente');
  const [erreur, setErreur] = useState('');

  const fetchCommandes = async () => {
    const res = await api.get('/commandes');
    setCommandes(res.data);
  };

  const fetchClients = async () => {
    const res = await api.get('/clients');
    setClients(res.data);
  };

  useEffect(() => { fetchCommandes(); fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/commandes', { reference, clientId, statut });
      setReference(''); setClientId(''); setStatut('en_attente');
      fetchCommandes();
    } catch (err) {
      setErreur('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette commande ?')) {
      await api.delete(`/commandes/${id}`);
      fetchCommandes();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Commandes</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Référence *" value={reference} onChange={e => setReference(e.target.value)} required style={{ padding: 8 }} />
        <select value={clientId} onChange={e => setClientId(e.target.value)} required style={{ padding: 8 }}>
          <option value="">Choisir un client *</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
          ))}
        </select>
        <select value={statut} onChange={e => setStatut(e.target.value)} style={{ padding: 8 }}>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Référence</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Client</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Statut</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Date</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: 10 }}>{c.reference}</td>
              <td style={{ padding: 10 }}>{c.client?.nom} {c.client?.prenom}</td>
              <td style={{ padding: 10 }}>{c.statut}</td>
              <td style={{ padding: 10 }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
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

export default Commandes;