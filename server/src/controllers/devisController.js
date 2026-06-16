const prisma = require('../config/prisma');

const genererReference = async () => {
  const annee = new Date().getFullYear().toString().slice(-2);
  const count = await prisma.devis.count();
  const num = String(count + 1).padStart(4, '0');
  return `DEV-${num}-${annee}`;
};

const getDevis = async (req, res) => {
  try {
    const { search } = req.query;
    const devis = await prisma.devis.findMany({
      where: search ? {
        OR: [
          { reference: { contains: search, mode: 'insensitive' } },
          { client: { nom: { contains: search, mode: 'insensitive' } } },
          { client: { telephone: { contains: search } } },
        ]
      } : undefined,
      include: { client: true, lignes: true },
      orderBy: { createdAt: 'desc' }
    });

    const result = devis.map(d => {
      const total = d.lignes.reduce((sum, l) => sum + l.montant, 0);
      return { ...d, total };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnDevis = async (req, res) => {
  try {
    const devis = await prisma.devis.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { client: true, lignes: true, commande: true }
    });
    if (!devis) return res.status(404).json({ error: 'Devis introuvable' });
    const total = devis.lignes.reduce((sum, l) => sum + l.montant, 0);
    res.json({ ...devis, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDevis = async (req, res) => {
  try {
    const { clientId, lignes, notes } = req.body;
    if (!clientId || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Client et articles obligatoires' });
    }

    const reference = await genererReference();

    const devis = await prisma.devis.create({
      data: {
        reference,
        clientId: parseInt(clientId),
        notes,
        lignes: {
          create: lignes.map((l, i) => ({
            designation: l.designation,
            quantite: parseFloat(l.quantite),
            prixUnitaire: parseFloat(l.prixUnitaire) || 0,
            montant: parseFloat(l.quantite) * (parseFloat(l.prixUnitaire) || 0),
            ordre: i
          }))
        }
      },
      include: { client: true, lignes: true }
    });

    res.status(201).json(devis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatutDevis = async (req, res) => {
  try {
    const { statut } = req.body;
    const devis = await prisma.devis.update({
      where: { id: parseInt(req.params.id) },
      data: { statut }
    });
    res.json(devis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDevis, getUnDevis, createDevis, updateStatutDevis };