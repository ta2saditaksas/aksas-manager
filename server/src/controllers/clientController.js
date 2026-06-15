const prisma = require('../config/prisma');

// Lister tous les clients
const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Voir un client
const getClient = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!client) return res.status(404).json({ error: 'Client introuvable' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un client
const createClient = async (req, res) => {
  try {
    const { nom, prenom, entreprise, telephone, email, adresse } = req.body;
    if (!nom) return res.status(400).json({ error: 'Le nom est obligatoire' });
    const client = await prisma.client.create({
      data: { nom, prenom, entreprise, telephone, email, adresse }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un client
const updateClient = async (req, res) => {
  try {
    const { nom, prenom, entreprise, telephone, email, adresse } = req.body;
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: { nom, prenom, entreprise, telephone, email, adresse }
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };