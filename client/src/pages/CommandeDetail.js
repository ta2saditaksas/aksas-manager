import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ImpressionCommande from '../components/ImpressionCommande';

const STATUTS = {
  en_attente: { label: 'En attente', color: '#1a4fa0', bg: '#e8f0fc' },
  en_cours: { label: 'En cours', color: '#854F0B', bg: '#faeeda' },
  partiellement_livree: { label: 'Part. livrée', color: '#6B3FA0', bg: '#f0e8fc' },
  livree: { label: 'Livrée', color: '#3B6D11', bg: '#eaf3de' },
  annulee: { label: 'Annulée', color: '#A32D2D', bg: '#fcebeb' },
};

function CommandeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [showPaiement, setShowPaiement] = useState(false);
  const [montantPaiement, setMontantPaiement] = useState('');
  const [notesPaiement, setNotesPaiement] = useState('');

  const fetchCommande = async () => {
    const res = await api.get(`/commandes/${id}`);
    setCommande(res.data);
  };

  useEffect(() => { fetchCommande(); }, [id]);

  const handlePaiement = async (e) => {
    e.preventDefault();
    await api.post(`/commandes/${id}/paiements`, { montant: montantPaiement, notes: notesPaiement });
    setShowPaiement(false);
    setMontantPaiement('');
    setNotesPaiement('');
    fetchCommande();
  };

  const handleStatut = async (statut) => {
    await api.put(`/commandes/${id}`, { statut });
    fetchCommande();
  };

  if (!commande) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;

  const statut = STATUTS[commande.statut] || { label: commande.statut, color: '#888', bg: '#f1f1f1' };
  const pct = commande.total > 0 ? Math.round((commande.verse / commande.total) * 100) : 0;

  return (
    <div>
      <button onClick={() => navigate('/commandes')} style={{ background: 'none', border: 'none', color: '#1a4fa0', cursor: 'pointer', fontSize: 13, marginBottom: 16 }}>
        ← Retour aux commandes
      </button>

      <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 500, color: '#1a4fa0' }}>{commande.reference}</h2>
              <span style={{ background: statut.bg, color: statut.color, padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{statut.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>
              Client : <strong>{commande.client?.nom} {commande.client?.prenom}</strong> · {commande.client?.telephone}
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              Date : {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
              {commande.dateLivraison && ` · Livraison prévue : ${new Date(commande.dateLivraison).toLocaleDateString('fr-FR')}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={commande.statut}
              onChange={e => handleStatut(e.target.value)}
              style={{ padding: '7px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
            >
              {Object.entries(STATUTS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
            </select>
            <ImpressionCommande commande={commande} />
            <button
              onClick={() => setShowPaiement(true)}
              style={{ background: '#F5C417', color: '#1a3a7a', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', fontWeight: 500, fontSize: 13 }}
            >
              + Versement
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total commande', value: `${(commande.total || 0).toLocaleString()} DA`, color: '#111' },
            { label: 'Total versé', value: `${(commande.verse || 0).toLocaleString()} DA`, color: '#3B6D11' },
            { label: 'Reste à payer', value: `${(commande.resteAPayer || 0).toLocaleString()} DA`, color: commande.resteAPayer > 0 ? '#A32D2D' : '#3B6D11' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f5f7fb', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 6, background: '#f1f1f1', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#1a4fa0', borderRadius: 99, transition: 'width 0.3s' }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#444' }}>Articles commandés</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f5f7fb' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#666', fontWeight: 500 }}>Désignation</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Qté</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Livré</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Reste</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Prix/U</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#666', fontWeight: 500 }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {commande.lignes?.map((l, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid #f1f1f1' }}>
                <td style={{ padding: '10px 12px' }}>{l.designation}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{l.quantite}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#3B6D11' }}>{l.quantiteLivree}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: l.quantite - l.quantiteLivree > 0 ? '#A32D2D' : '#3B6D11' }}>
                  {l.quantite - l.quantiteLivree}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{l.prixUnitaire.toLocaleString()} DA</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>{l.montant.toLocaleString()} DA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {commande.paiements?.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#444' }}>Historique des versements</h3>
          {commande.paiements.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #f1f1f1', fontSize: 13 }}>
              <span style={{ color: '#666' }}>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
              {p.notes && <span style={{ color: '#888' }}>{p.notes}</span>}
              <span style={{ fontWeight: 500, color: '#3B6D11' }}>{p.montant.toLocaleString()} DA</span>
            </div>
          ))}
        </div>
      )}

      {showPaiement && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 380 }}>
            <h3 style={{ marginBottom: 16, color: '#1a4fa0', fontSize: 16 }}>Ajouter un versement</h3>
            <form onSubmit={handlePaiement}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Montant (DA) *</label>
                <input
                  type="number"
                  value={montantPaiement}
                  onChange={e => setMontantPaiement(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Notes</label>
                <input
                  value={notesPaiement}
                  onChange={e => setNotesPaiement(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 6, fontSize: 13 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPaiement(false)} style={{ padding: '8px 16px', border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 13 }}>Annuler</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#1a4fa0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommandeDetail;