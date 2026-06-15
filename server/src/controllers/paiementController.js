const prisma = require('../config/prisma');

// Lister tous les paiements
const getPaiements = async (req, res) => {
  try {
    const paiements = await prisma.paiement.findMany({
      include: { commande: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Voir un paiement
const getPaiement = async (req, res) => {
  try {
    const paiement = await prisma.paiement.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { commande: true }
    });
    if (!paiement) return res.status(404).json({ error: 'Paiement introuvable' });
    res.json(paiement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un paiement
const createPaiement = async (req, res) => {
  try {
    const { montant, commandeId, statut } = req.body;
    if (!montant || !commandeId) {
      return res.status(400).json({ error: 'Montant et commande obligatoires' });
    }
    const paiement = await prisma.paiement.create({
      data: { montant: parseFloat(montant), commandeId: parseInt(commandeId), statut: statut || 'en_attente' }
    });
    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un paiement
const updatePaiement = async (req, res) => {
  try {
    const { montant, commandeId, statut } = req.body;
    const paiement = await prisma.paiement.update({
      where: { id: parseInt(req.params.id) },
      data: { montant: parseFloat(montant), commandeId: parseInt(commandeId), statut }
    });
    res.json(paiement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un paiement
const deletePaiement = async (req, res) => {
  try {
    await prisma.paiement.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Paiement supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getPaiements, getPaiement, createPaiement, updatePaiement, deletePaiement };