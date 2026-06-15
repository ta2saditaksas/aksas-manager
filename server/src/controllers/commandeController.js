const prisma = require('../config/prisma');

// Lister toutes les commandes
const getCommandes = async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Voir une commande
const getCommande = async (req, res) => {
  try {
    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { client: true, paiements: true }
    });
    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(commande);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer une commande
const createCommande = async (req, res) => {
  try {
    const { reference, clientId, statut } = req.body;
    if (!reference || !clientId) return res.status(400).json({ error: 'Référence et client obligatoires' });
    const commande = await prisma.commande.create({
      data: { reference, clientId: parseInt(clientId), statut: statut || 'en_attente' }
    });
    res.status(201).json(commande);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier une commande
const updateCommande = async (req, res) => {
  try {
    const { reference, clientId, statut } = req.body;
    const commande = await prisma.commande.update({
      where: { id: parseInt(req.params.id) },
      data: { reference, clientId: parseInt(clientId), statut }
    });
    res.json(commande);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer une commande
const deleteCommande = async (req, res) => {
  try {
    await prisma.commande.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Commande supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getCommandes, getCommande, createCommande, updateCommande, deleteCommande };
