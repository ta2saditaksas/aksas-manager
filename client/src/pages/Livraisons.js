import { useState, useEffect } from 'react';
import api from '../api';
import ImpressionLivraison from '../components/ImpressionLivraison';

function ModalLivraison({ onClose, onSave }) {
  const [commandes, setCommandes] = useState([]);
  const [commandeId, setCommandeId] = useState('');
  const [lignes, setLignes] = useState([]);
  const [notes, setNotes] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');

  useEffect(() => {
    api.get('/commandes').then(r => {
      setCommandes(r.data.filter(c => c.statut !== 'livree' && c.statut !== 'annulee'));
    });
  }, []);

  const handleSelectCommande = async (id) => {
    setCommandeId(id);
    if (!id) { setLignes([]); return; }
    const res = await api.get(`/commandes/${id}`);
    setLignes(res.data.lignes.map(l => ({
      ligneCommandeId: l.id,
      designation: l.designation,
      quantiteCommandee: l.quantite,
      quantiteDejaLivree: l.quantiteLivree,
      resteALivrer: l.quantite - l.quantiteLivree,
      quantiteLivree: ''
    })).filter(l => l.resteALivrer > 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lignesValides = lignes.filter(l => parseFloat(l.quantiteLivree) > 0);
    if (lignesValides.length === 0) return alert('Entrez au moins une quantité livrée');
    await onSave({ commandeId, lignes: lignesValides, notes, dateLivraison });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 20, color: '#1a4fa0', fontSize: 16 }}>Nouvelle livraison</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Commande *</label>
              <select
                value={commandeId}
                onChange={e => handleSelectCommande(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
              >
                <option value="">Choisir une commande</option>
                {commandes.map(c => (
                  <option key={c.id} value={c.id}>{c.reference} — {c.client?.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Date de livraison</label>
              <input
                type="date"
                value={dateLivraison}
                onChange={e => setDateLivraison(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
              />
            </div>
          </div>

          {lignes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f5f7fb' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: '#666', fontWeight: 500 }}>Article</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Commandé</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Déjà livré</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Reste</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#666', fontWeight: 500 }}>À livrer</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid #f1f1f1' }}>
                      <td style={{ padding: '8px 10px' }}>{l.designation}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{l.quantiteCommandee}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#3B6D11' }}>{l.quantiteDejaLivree}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#A32D2D' }}>{l.resteALivrer}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          max={l.resteALivrer}
                          value={l.quantiteLivree}
                          onChange={e => setLignes(lignes.map((x, j) => j === i ? { ...x, quantiteLivree: e.target.value } : x))}
                          style={{ width: 80, padding: '4px 8px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13, textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 13 }}>Annuler</button>
            <button type="submit" style={{ padding: '8px 16px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Enregistrer la livraison</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Livraisons() {
  const [livraisons, setLivraisons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLivraisons = async () => {
    const res = await api.get('/livraisons');
    setLivraisons(res.data);
  };

  useEffect(() => { fetchLivraisons(); }, []);

  const handleSave = async (form) => {
    await api.post('/livraisons', form);
    setShowModal(false);
    fetchLivraisons();
  };

  return (
    <div>
      {showModal && <ModalLivraison onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a4fa0', flex: 1 }}>Livraisons</h1>
        <button onClick={() => setShowModal(true)} style={{
          background: '#F5C417', color: '#1a3a7a', border: 'none',
          borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 13
        }}>
          + Nouvelle livraison
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {livraisons.map(l => (
          <div key={l.id} style={{ background: 'white', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontWeight: 500, color: '#1a4fa0', fontSize: 14 }}>{l.reference}</span>
              <span style={{ fontSize: 13, color: '#444' }}>{l.commande?.client?.nom}</span>
              <span style={{ fontSize: 13, color: '#666' }}>→ {l.commande?.reference}</span>
              <span style={{ fontSize: 12, color: '#888' }}>
                {new Date(l.dateLivraison).toLocaleDateString('fr-FR')}
              </span>
              <div style={{ marginLeft: 'auto' }}>
                <ImpressionLivraison livraison={l} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {l.lignes?.length} article(s) livré(s)
              {l.notes && ` · ${l.notes}`}
            </div>
          </div>
        ))}
        {livraisons.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14, background: 'white', borderRadius: 10 }}>
            Aucune livraison
          </div>
        )}
      </div>
    </div>
  );
}

export default Livraisons;