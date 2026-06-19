import { Link, useLocation } from 'react-router-dom';

function Navbar({ utilisateur, onLogout }) {
  const location = useLocation();

  const links = [
    { to: '/clients', label: 'Clients' },
    { to: '/commandes', label: 'Commandes' },
    { to: '/devis', label: 'Devis' },
    { to: '/livraisons', label: 'Livraisons' },
  ];

  return (
    <nav style={{
      background: '#1a4fa0',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: 56,
      gap: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{ color: '#F5C417', fontWeight: 500, fontSize: 16, marginRight: 16 }}>
        ETS AKSAS
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 400, marginLeft: 8 }}>
          Laminage & Profilage
        </span>
      </div>

      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            color: location.pathname.startsWith(link.to) ? '#F5C417' : 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontSize: 13,
            padding: '6px 12px',
            borderRadius: 6,
            background: location.pathname.startsWith(link.to) ? 'rgba(245,196,23,0.12)' : 'transparent'
          }}
        >
          {link.label}
        </Link>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#F5C417', color: '#1a4fa0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 500
        }}>
          {utilisateur.nom.charAt(0).toUpperCase()}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{utilisateur.nom}</span>
        <button onClick={onLogout} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.6)',
          border: '0.5px solid rgba(255,255,255,0.3)',
          borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12
        }}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;