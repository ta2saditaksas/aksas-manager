import { useState, useEffect } from 'react';
import api from '../api';

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [montant, setMontant] = useState('');
  const [commandeId, setCommandeId] = useState('');
  const [statut, setStatut] = useState('en_attente');
  const [erreur, setErreur] = useState('');

  const fetchPaiements = async () => {
    const res = await api.get('/paiements');
    setPaiements(res.data);
  };

  const fetchCommandes = async () => {
    const res = await api.get('/commandes');
    setCommandes(res.data);
  };

  useEffect(() => { fetchPaiements(); fetchCommandes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/paiements', { montant, commandeId, statut });
      setMontant(''); setCommandeId(''); setStatut('en_attente');
      fetchPaiements();
    } catch (err) {
      setErreur('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce paiement ?')) {
      await api.delete(`/paiements/${id}`);
      fetchPaiements();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Paiements</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Montant *" type="number" value={montant} onChange={e => setMontant(e.target.value)} required style={{ padding: 8 }} />
        <select value={commandeId} onChange={e => setCommandeId(e.target.value)} required style={{ padding: 8 }}>
          <option value="">Choisir une commande *</option>
          {commandes.map(c => (
            <option key={c.id} value={c.id}>{c.reference}</option>
          ))}
        </select>
        <select value={statut} onChange={e => setStatut(e.target.value)} style={{ padding: 8 }}>
          <option value="en_attente">En attente</option>
          <option value="payé">Payé</option>
          <option value="annulé">Annulé</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Commande</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Montant</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Statut</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Date</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: 10 }}>{p.commande?.reference}</td>
              <td style={{ padding: 10 }}>{p.montant} DA</td>
              <td style={{ padding: 10 }}>{p.statut}</td>
              <td style={{ padding: 10 }}>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(p.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
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

export default Paiements;