const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
const register = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;
    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ error: 'Nom, email et mot de passe obligatoires' });
    }
    const existe = await prisma.utilisateur.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(motDePasse, 10);
    const utilisateur = await prisma.utilisateur.create({
      data: { nom, email, motDePasse: hash, role: role || 'user' }
    });
    res.status(201).json({ message: 'Compte créé', id: utilisateur.id });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ error: 'Email et mot de passe obligatoires' });
    }
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur) return res.status(401).json({ error: 'Identifiants incorrects' });

    const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!valide) return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login };