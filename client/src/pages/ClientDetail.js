import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = [
  { value: 'occasionnel', label: 'Occasionnel', color: '#854F0B', bg: '#faeeda' },
  { value: 'habitue', label: 'Habitué', color: '#3B6D11', bg: '#eaf3de' },
  { value: 'organisation', label: 'Organisation', color: '#1a4fa0', bg: '#e8f0fc' },
];

const STATUTS = {
  en_attente: { label: 'En attente', color: '#1a4fa0', bg: '#e8f0fc' },
  en_cours: { label: 'En cours', color: '#854F0B', bg: '#faeeda' },
  partiellement_livree: { label: 'Part. livrée', color: '#6B3FA0', bg: '#f0e8fc' },
  livree: { label: 'Livrée', color: '#3B6D11', bg: '#eaf3de' },
  annulee: { label: 'Annulée', color: '#A32D2D', bg: '#fcebeb' },
};

function Badge({ value, map }) {
  const s = map[value] || { label: value, color: '#888', bg: '#f1f1f1' };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>
      {s.label}
    </span>
  );
}

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [onglet, setOnglet] = useState('commandes');
  const [editCategorie, setEditCategorie] = useState(false);
  const [nouvelleCategorie, setNouvelleCategorie] = useState('');

  const fetchClient = async () => {
    const res = await api.get(`/clients/${id}`);
    setClient(res.data);
    setNouvelleCategorie(res.data.categorie);
  };

  useEffect(() => { fetchClient(); }, [id]);

  const handleUpdateCategorie = async () => {
    await api.put(`/clients/${id}`, { ...client, categorie: nouvelleCategorie });
    setEditCategorie(false);
    fetchClient();
  };

  if (!client) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;

  const totalFacture = client.commandes?.reduce((sum, c) => sum + (c.total || 0), 0) || 0;
  const totalVerse = client.commandes?.reduce((sum, c) => sum + (c.verse || 0), 0) || 0;
  const resteAPayer = totalFacture - totalVerse;
  const nbCommandes = client.commandes?.length || 0;

  const cat = CATEGORIES.find(c => c.value === client.categorie) || CATEGORIES[0];

  return (
    <div>
      <button onClick={() => navigate('/clients')} style={{ background: 'none', border: 'none', color: '#1a4fa0', cursor: 'pointer', fontSize: 13, marginBottom: 16 }}>
        ← Retour aux clients
      </button>

      <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#1a4fa0', color: '#F5C417',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 500, flexShrink: 0
          }}>
            {client.nom.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 500, color: '#111' }}>{client.nom} {client.prenom}</h2>
              {editCategorie ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select
                    value={nouvelleCategorie}
                    onChange={e => setNouvelleCategorie(e.target.value)}
                    style={{ padding: '3px 8px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 12 }}
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <button onClick={handleUpdateCategorie} style={{ padding: '3px 10px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>OK</button>
                  <button onClick={() => setEditCategorie(false)} style={{ padding: '3px 10px', background: 'white', border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Annuler</button>
                </div>
              ) : (
                <span
                  onClick={() => setEditCategorie(true)}
                  style={{ background: cat.bg, color: cat.color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
                  title="Cliquer pour modifier"
                >
                  {cat.label} ✎
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#666', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>{client.reference}</span>
              {client.telephone && <span>📞 {client.telephone}</span>}
              {client.email && <span>✉ {client.email}</span>}
              {client.adresse && <span>📍 {client.adresse}</span>}
            </div>
            {client.notes && <div style={{ marginTop: 8, fontSize: 12, color: '#888', fontStyle: 'italic' }}>{client.notes}</div>}
          </div>
          <button
            onClick={() => navigate(`/commandes?nouveau=1&clientId=${client.id}`)}
            style={{ background: '#F5C417', color: '#1a3a7a', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}
          >
            + Nouvelle commande
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Commandes', value: nbCommandes, color: '#1a4fa0' },
            { label: 'Total facturé', value: `${totalFacture.toLocaleString()} DA`, color: '#111' },
            { label: 'Versé', value: `${totalVerse.toLocaleString()} DA`, color: '#3B6D11' },
            { label: 'Reste à payer', value: `${resteAPayer.toLocaleString()} DA`, color: resteAPayer > 0 ? '#A32D2D' : '#3B6D11' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f5f7fb', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {['commandes', 'devis'].map(o => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            style={{
              padding: '8px 18px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
              background: onglet === o ? '#1a4fa0' : 'white',
              color: onglet === o ? 'white' : '#666',
              fontWeight: onglet === o ? 500 : 400
            }}
          >
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </button>
        ))}
      </div>

      {onglet === 'commandes' && (
        <div style={{ display: 'grid', gap: 10 }}>
          {client.commandes?.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14, background: 'white', borderRadius: 10 }}>
              Aucune commande
            </div>
          )}
          {client.commandes?.map(c => {
            const pct = c.total > 0 ? Math.round((c.verse / c.total) * 100) : 0;
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/commandes/${c.id}`)}
                style={{ background: 'white', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, color: '#1a4fa0', fontSize: 14 }}>{c.reference}</span>
                  <Badge value={c.statut} map={STATUTS} />
                  <span style={{ marginLeft: 'auto', fontSize: 13, color: '#111', fontWeight: 500 }}>{(c.total || 0).toLocaleString()} DA</span>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                  {c.lignes?.length} article(s) · {new Date(c.dateCommande).toLocaleDateString('fr-FR')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 4 }}>
                  <span>Versé : {(c.verse || 0).toLocaleString()} DA</span>
                  <span>Reste : {(c.resteAPayer || 0).toLocaleString()} DA</span>
                </div>
                <div style={{ height: 4, background: '#f1f1f1', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#1a4fa0', borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {onglet === 'devis' && (
        <div style={{ display: 'grid', gap: 10 }}>
          {client.devis?.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14, background: 'white', borderRadius: 10 }}>
              Aucun devis
            </div>
          )}
          {client.devis?.map(d => (
            <div key={d.id} style={{ background: 'white', border: '0.5px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 500, color: '#854F0B', fontSize: 14 }}>{d.reference}</span>
                <span style={{ fontSize: 11, color: '#888' }}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</span>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#111', fontWeight: 500 }}>
                  {d.lignes?.reduce((sum, l) => sum + l.montant, 0).toLocaleString()} DA
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientDetail;