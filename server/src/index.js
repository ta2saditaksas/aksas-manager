const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes publiques
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Middleware protection
const { protect } = require('./middlewares/authMiddleware');

// Routes protégées
const clientRoutes = require('./routes/clientRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const devisRoutes = require('./routes/devisRoutes');
const livraisonRoutes = require('./routes/livraisonRoutes');

app.use('/api/clients', protect, clientRoutes);
app.use('/api/commandes', protect, commandeRoutes);
app.use('/api/devis', protect, devisRoutes);
app.use('/api/livraisons', protect, livraisonRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Aksas Manager API fonctionne ' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});