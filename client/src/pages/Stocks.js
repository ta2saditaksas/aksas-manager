import { useState, useEffect } from 'react';
import api from '../api';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [designation, setDesignation] = useState('');
  const [quantite, setQuantite] = useState('');
  const [unite, setUnite] = useState('');
  const [seuilAlerte, setSeuilAlerte] = useState('');
  const [erreur, setErreur] = useState('');

  const fetchStocks = async () => {
    const res = await api.get('/stocks');
    setStocks(res.data);
  };

  useEffect(() => { fetchStocks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/stocks', { designation, quantite, unite, seuilAlerte });
      setDesignation(''); setQuantite(''); setUnite(''); setSeuilAlerte('');
      fetchStocks();
    } catch (err) {
      setErreur('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce stock ?')) {
      await api.delete(`/stocks/${id}`);
      fetchStocks();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Stocks</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Désignation *" value={designation} onChange={e => setDesignation(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="Quantité *" type="number" value={quantite} onChange={e => setQuantite(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="Unité *" value={unite} onChange={e => setUnite(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="Seuil alerte" type="number" value={seuilAlerte} onChange={e => setSeuilAlerte(e.target.value)} style={{ padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Ajouter
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Désignation</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Quantité</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Unité</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Seuil alerte</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0', background: s.quantite <= s.seuilAlerte ? '#fef2f2' : 'white' }}>
              <td style={{ padding: 10 }}>{s.designation}</td>
              <td style={{ padding: 10 }}>{s.quantite}</td>
              <td style={{ padding: 10 }}>{s.unite}</td>
              <td style={{ padding: 10 }}>{s.seuilAlerte}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
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

export default Stocks;