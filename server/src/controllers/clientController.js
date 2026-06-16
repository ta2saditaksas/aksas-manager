const prisma = require('../config/prisma');

const genererReference = async () => {
  const count = await prisma.client.count();
  const num = String(count + 1).padStart(4, '0');
  return `CLI-${num}`;
};

const getClients = async (req, res) => {
  try {
    const { search } = req.query;
    const clients = await prisma.client.findMany({
      where: search ? {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { prenom: { contains: search, mode: 'insensitive' } },
          { telephone: { contains: search } },
          { reference: { contains: search, mode: 'insensitive' } },
        ]
      } : undefined,
      include: {
        _count: { select: { commandes: true, devis: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClient = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        commandes: {
          include: {
            paiements: true,
            livraisons: true,
            lignes: true
          },
          orderBy: { createdAt: 'desc' }
        },
        devis: {
          include: { lignes: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!client) return res.status(404).json({ error: 'Client introuvable' });

    const commandes = client.commandes.map(c => {
      const total = c.lignes.reduce((sum, l) => sum + l.montant, 0);
      const verse = c.paiements.reduce((sum, p) => sum + p.montant, 0);
      return { ...c, total, verse, resteAPayer: total - verse };
    });

    res.json({ ...client, commandes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, adresse, categorie, notes } = req.body;
    if (!nom) return res.status(400).json({ error: 'Le nom est obligatoire' });
    const reference = await genererReference();
    const client = await prisma.client.create({
      data: { reference, nom, prenom, telephone, email, adresse, categorie: categorie || 'occasionnel', notes }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, adresse, categorie, notes } = req.body;
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: { nom, prenom, telephone, email, adresse, categorie, notes }
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };