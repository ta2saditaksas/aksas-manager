import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const STATUTS = {
  en_attente: { label: 'En attente', color: '#1a4fa0', bg: '#e8f0fc' },
  en_cours: { label: 'En cours', color: '#854F0B', bg: '#faeeda' },
  partiellement_livree: { label: 'Part. livrée', color: '#6B3FA0', bg: '#f0e8fc' },
  livree: { label: 'Livrée', color: '#3B6D11', bg: '#eaf3de' },
  annulee: { label: 'Annulée', color: '#A32D2D', bg: '#fcebeb' },
};

function LigneArticle({ ligne, onChange, onDelete }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 110px 110px 32px', gap: 6, marginBottom: 6 }}>
      <input
        placeholder="Désignation de l'article"
        value={ligne.designation}
        onChange={e => onChange({ ...ligne, designation: e.target.value })}
        style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
      />
      <input
        placeholder="Qté"
        type="number"
        value={ligne.quantite}
        onChange={e => onChange({ ...ligne, quantite: e.target.value, montant: e.target.value * ligne.prixUnitaire })}
        style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
      />
      <input
        placeholder="Prix/U"
        type="number"
        value={ligne.prixUnitaire}
        onChange={e => onChange({ ...ligne, prixUnitaire: e.target.value, montant: ligne.quantite * e.target.value })}
        style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
      />
      <div style={{ padding: '7px 10px', background: '#f5f7fb', borderRadius: 6, fontSize: 13, color: '#444', textAlign: 'right' }}>
        {(ligne.quantite * ligne.prixUnitaire).toLocaleString()} DA
      </div>
      <button onClick={onDelete} style={{ background: '#fcebeb', color: '#A32D2D', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
    </div>
  );
}

function Modal({ onClose, onSave, clientIdInitial }) {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(clientIdInitial || '');
  const [lignes, setLignes] = useState([{ designation: '', quantite: '', prixUnitaire: '', montant: 0 }]);
  const [notes, setNotes] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data));
  }, []);

  const total = lignes.reduce((sum, l) => sum + (parseFloat(l.quantite) || 0) * (parseFloat(l.prixUnitaire) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ clientId, lignes, notes, dateLivraison });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 20, color: '#1a4fa0', fontSize: 16 }}>Nouvelle commande</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Client *</label>
              <select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
              >
                <option value="">Choisir un client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom} — {c.reference}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Date de livraison prévue</label>
              <input
                type="date"
                value={dateLivraison}
                onChange={e => setDateLivraison(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 110px 110px 32px', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#888' }}>Désignation</span>
              <span style={{ fontSize: 11, color: '#888' }}>Quantité</span>
              <span style={{ fontSize: 11, color: '#888' }}>Prix/Unité</span>
              <span style={{ fontSize: 11, color: '#888' }}>Montant</span>
              <span></span>
            </div>
            {lignes.map((l, i) => (
              <LigneArticle
                key={i}
                ligne={l}
                onChange={nl => setLignes(lignes.map((x, j) => j === i ? nl : x))}
                onDelete={() => setLignes(lignes.filter((_, j) => j !== i))}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLignes([...lignes, { designation: '', quantite: '', prixUnitaire: '', montant: 0 }])}
            style={{ fontSize: 13, color: '#1a4fa0', background: 'none', border: '0.5px dashed #1a4fa0', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', marginBottom: 16, width: '100%' }}
          >
            + Ajouter un article
          </button>

          <div style={{ background: '#f5f7fb', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#666' }}>Total commande</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: '#1a4fa0' }}>{total.toLocaleString()} DA</span>
          </div>

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
            <button type="submit" style={{ padding: '8px 16px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Créer la commande</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientIdInitial = searchParams.get('clientId');

  useEffect(() => {
    if (searchParams.get('nouveau') === '1') setShowModal(true);
  }, []);

  const fetchCommandes = async () => {
    const res = await api.get(`/commandes${search ? `?search=${search}` : ''}`);
    setCommandes(res.data);
  };

  useEffect(() => { fetchCommandes(); }, [search]);

  const handleSave = async (form) => {
    await api.post('/commandes', form);
    setShowModal(false);
    fetchCommandes();
  };

  return (
    <div>
      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} clientIdInitial={clientIdInitial} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a4fa0', flex: 1 }}>Commandes</h1>
        <button onClick={() => setShowModal(true)} style={{
          background: '#F5C417', color: '#1a3a7a', border: 'none',
          borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 13
        }}>
          + Nouvelle commande
        </button>
      </div>

      <input
        placeholder="Rechercher par référence, client, téléphone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }}
      />

      <div style={{ display: 'grid', gap: 10 }}>
        {commandes.map(c => {
          const pct = c.total > 0 ? Math.round((c.verse / c.total) * 100) : 0;
          const statut = STATUTS[c.statut] || { label: c.statut, color: '#888', bg: '#f1f1f1' };
          return (
            <div
              key={c.id}
              onClick={() => navigate(`/commandes/${c.id}`)}
              style={{ background: 'white', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#1a4fa0'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontWeight: 500, color: '#1a4fa0', fontSize: 14 }}>{c.reference}</span>
                <span style={{ fontSize: 13, color: '#444' }}>{c.client?.nom} {c.client?.prenom}</span>
                <span style={{ background: statut.bg, color: statut.color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>{statut.label}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 500, fontSize: 14 }}>{(c.total || 0).toLocaleString()} DA</span>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                {c.lignes?.length} article(s) · {new Date(c.dateCommande).toLocaleDateString('fr-FR')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 4 }}>
                <span>Versé : {(c.verse || 0).toLocaleString()} DA</span>
                <span style={{ color: c.resteAPayer > 0 ? '#A32D2D' : '#3B6D11' }}>Reste : {(c.resteAPayer || 0).toLocaleString()} DA</span>
              </div>
              <div style={{ height: 4, background: '#f1f1f1', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#1a4fa0', borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
        {commandes.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14, background: 'white', borderRadius: 10 }}>
            Aucune commande
          </div>
        )}
      </div>
    </div>
  );
}

export default Commandes;