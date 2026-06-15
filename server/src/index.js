const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes publiques
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Middleware de protection
const { protect } = require('./middlewares/authMiddleware');

// Routes protégées
const clientRoutes = require('./routes/clientRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const stockRoutes = require('./routes/stockRoutes');
const paiementRoutes = require('./routes/paiementRoutes');

app.use('/api/clients', protect, clientRoutes);
app.use('/api/commandes', protect, commandeRoutes);
app.use('/api/stocks', protect, stockRoutes);
app.use('/api/paiements', protect, paiementRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Aksas Manager API fonctionne ' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});