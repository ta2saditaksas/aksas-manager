import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = [
  { value: 'occasionnel', label: 'Occasionnel', color: '#854F0B', bg: '#faeeda' },
  { value: 'habitue', label: 'Habitué', color: '#3B6D11', bg: '#eaf3de' },
  { value: 'organisation', label: 'Organisation', color: '#1a4fa0', bg: '#e8f0fc' },
];

function Badge({ categorie }) {
  const cat = CATEGORIES.find(c => c.value === categorie) || CATEGORIES[0];
  return (
    <span style={{
      background: cat.bg, color: cat.color,
      padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500
    }}>
      {cat.label}
    </span>
  );
}

function Modal({ onClose, onSave }) {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', adresse: '', categorie: 'occasionnel', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 20, color: '#1a4fa0', fontSize: 16 }}>Nouveau client</h3>
        <form onSubmit={handleSubmit}>
          {[
            { key: 'nom', label: 'Nom *', required: true },
            { key: 'prenom', label: 'Prénom' },
            { key: 'telephone', label: 'Téléphone' },
            { key: 'email', label: 'Email' },
            { key: 'adresse', label: 'Adresse' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required={f.required}
                style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Catégorie</label>
            <select
              value={form.categorie}
              onChange={e => setForm({ ...form, categorie: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 13 }}>Annuler</button>
            <button type="submit" style={{ padding: '8px 16px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const navigate = useNavigate();

  const fetchClients = async () => {
    const res = await api.get(`/clients${search ? `?search=${search}` : ''}`);
    setClients(res.data);
  };

  useEffect(() => { fetchClients(); }, [search]);

  const handleSave = async (form) => {
    await api.post('/clients', form);
    setShowModal(false);
    fetchClients();
  };

  const filtered = filtreCategorie ? clients.filter(c => c.categorie === filtreCategorie) : clients;

  return (
    <div>
      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a4fa0', flex: 1 }}>Clients</h1>
        <button onClick={() => setShowModal(true)} style={{
          background: '#F5C417', color: '#1a3a7a', border: 'none',
          borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500, fontSize: 13
        }}>
          + Nouveau client
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Rechercher par nom, téléphone, référence..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
        />
        <select
          value={filtreCategorie}
          onChange={e => setFiltreCategorie(e.target.value)}
          style={{ padding: '9px 12px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(client => (
          <div
            key={client.id}
            onClick={() => navigate(`/clients/${client.id}`)}
            style={{
              background: 'white', border: '0.5px solid #e5e7eb',
              borderRadius: 10, padding: '14px 16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a4fa0'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: '#1a4fa0', color: '#F5C417',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 500, flexShrink: 0
            }}>
              {client.nom.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 500, fontSize: 14, color: '#111' }}>{client.nom} {client.prenom}</span>
                <Badge categorie={client.categorie} />
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {client.reference} · {client.telephone || 'Pas de téléphone'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
              <div>{client._count?.commandes || 0} commande(s)</div>
              <div>{client._count?.devis || 0} devis</div>
            </div>
            <div style={{ color: '#1a4fa0', fontSize: 18 }}>›</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14 }}>
            Aucun client trouvé
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;