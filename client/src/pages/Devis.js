import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ImpressionDevis from '../components/ImpressionDevis';

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
        onChange={e => onChange({ ...ligne, quantite: e.target.value })}
        style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
      />
      <input
        placeholder="Prix/U"
        type="number"
        value={ligne.prixUnitaire}
        onChange={e => onChange({ ...ligne, prixUnitaire: e.target.value })}
        style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
      />
      <div style={{ padding: '7px 10px', background: '#f5f7fb', borderRadius: 6, fontSize: 13, color: '#444', textAlign: 'right' }}>
        {((parseFloat(ligne.quantite) || 0) * (parseFloat(ligne.prixUnitaire) || 0)).toLocaleString()} DA
      </div>
      <button onClick={onDelete} style={{ background: '#fcebeb', color: '#A32D2D', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
    </div>
  );
}

function ModalDevis({ onClose, onSave }) {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [lignes, setLignes] = useState([{ designation: '', quantite: '', prixUnitaire: '' }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.get('/clients').then(r => setClients(r.data));
  }, []);

  const total = lignes.reduce((sum, l) => sum + (parseFloat(l.quantite) || 0) * (parseFloat(l.prixUnitaire) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ clientId, lignes, notes });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 20, color: '#1a4fa0', fontSize: 16 }}>Nouveau devis</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
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
            onClick={() => setLignes([...lignes, { designation: '', quantite: '', prixUnitaire: '' }])}
            style={{ fontSize: 13, color: '#1a4fa0', background: 'none', border: '0.5px dashed #1a4fa0', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', marginBottom: 16, width: '100%' }}
          >
            + Ajouter un article
          </button>

          <div style={{ background: '#f5f7fb', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#666' }}>Total devis</span>
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
            <button type="submit" style={{ padding: '8px 16px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Créer le devis</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Devis() {
  const [devis, setDevis] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchDevis = async () => {
    const res = await api.get(`/devis${search ? `?search=${search}` : ''}`);
    setDevis(res.data);
  };

  useEffect(() => { fetchDevis(); }, [search]);

  const handleSave = async (form) => {
    await api.post('/devis', form);
    setShowModal(false);
    fetchDevis();
  };

  const handleConvertir = async (d) => {
    navigate(`/commandes?nouveau=1&devisId=${d.id}&clientId=${d.clientId}`);
  };

  const STATUTS = {
    en_attente: { label: 'En attente', color: '#854F0B', bg: '#faeeda' },
    confirme: { label: 'Confirmé', color: '#3B6D11', bg: '#eaf3de' },
    annule: { label: 'Annulé', color: '#A32D2D', bg: '#fcebeb' },
  };

  return (
    <div>
      {showModal && <ModalDevis onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a4fa0', flex: 1 }}>Devis</h1>
        <button onClick={() => setShowModal(true)} style={{
          background: '#F5C417', color: '#1a3a7a', border: 'none',
          borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 13
        }}>
          + Nouveau devis
        </button>
      </div>

      <input
        placeholder="Rechercher par référence, client..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }}
      />

      <div style={{ display: 'grid', gap: 10 }}>
        {devis.map(d => {
          const statut = STATUTS[d.statut] || { label: d.statut, color: '#888', bg: '#f1f1f1' };
          return (
            <div key={d.id} style={{ background: 'white', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 500, color: '#854F0B', fontSize: 14 }}>{d.reference}</span>
                <span style={{ fontSize: 13, color: '#444' }}>{d.client?.nom} {d.client?.prenom}</span>
                <span style={{ background: statut.bg, color: statut.color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>{statut.label}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 500, fontSize: 14 }}>{(d.total || 0).toLocaleString()} DA</span>
                <ImpressionDevis devis={d} />
                {d.statut === 'en_attente' && (
                  <button
                    onClick={() => handleConvertir(d)}
                    style={{ padding: '5px 12px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
                  >
                    → Commande
                  </button>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                {d.lignes?.length} article(s) · {new Date(d.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          );
        })}
        {devis.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14, background: 'white', borderRadius: 10 }}>
            Aucun devis
          </div>
        )}
      </div>
    </div>
  );
}

export default Devis;