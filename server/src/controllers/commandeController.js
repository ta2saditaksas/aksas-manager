const prisma = require('../config/prisma');

const genererReference = async () => {
  const annee = new Date().getFullYear().toString().slice(-2);
  const count = await prisma.commande.count();
  const num = String(count + 1).padStart(4, '0');
  return `CMD-${num}-${annee}`;
};

const getCommandes = async (req, res) => {
  try {
    const { search } = req.query;
    const commandes = await prisma.commande.findMany({
      where: search ? {
        OR: [
          { reference: { contains: search, mode: 'insensitive' } },
          { client: { nom: { contains: search, mode: 'insensitive' } } },
          { client: { telephone: { contains: search } } },
        ]
      } : undefined,
      include: {
        client: true,
        lignes: true,
        paiements: true,
        livraisons: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = commandes.map(c => {
      const total = c.lignes.reduce((sum, l) => sum + l.montant, 0);
      const verse = c.paiements.reduce((sum, p) => sum + p.montant, 0);
      return { ...c, total, verse, resteAPayer: total - verse };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommande = async (req, res) => {
  try {
    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        client: true,
        lignes: true,
        paiements: true,
        livraisons: { include: { lignes: true } },
        devis: true
      }
    });
    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

    const total = commande.lignes.reduce((sum, l) => sum + l.montant, 0);
    const verse = commande.paiements.reduce((sum, p) => sum + p.montant, 0);

    res.json({ ...commande, total, verse, resteAPayer: total - verse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCommande = async (req, res) => {
  try {
    const { clientId, lignes, notes, dateLivraison, devisId } = req.body;
    if (!clientId || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Client et articles obligatoires' });
    }

    const reference = await genererReference();

    const commande = await prisma.commande.create({
      data: {
        reference,
        clientId: parseInt(clientId),
        devisId: devisId ? parseInt(devisId) : undefined,
        notes,
        dateLivraison: dateLivraison ? new Date(dateLivraison) : undefined,
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

    if (devisId) {
      await prisma.devis.update({
        where: { id: parseInt(devisId) },
        data: { statut: 'confirme' }
      });
    }

    res.status(201).json(commande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCommande = async (req, res) => {
  try {
    const { statut, notes, dateLivraison } = req.body;
    const commande = await prisma.commande.update({
      where: { id: parseInt(req.params.id) },
      data: { statut, notes, dateLivraison: dateLivraison ? new Date(dateLivraison) : undefined }
    });
    res.json(commande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ajouterPaiement = async (req, res) => {
  try {
    const { montant, notes } = req.body;
    if (!montant) return res.status(400).json({ error: 'Montant obligatoire' });
    const paiement = await prisma.paiement.create({
      data: {
        commandeId: parseInt(req.params.id),
        montant: parseFloat(montant),
        notes
      }
    });
    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCommandes, getCommande, createCommande, updateCommande, ajouterPaiement };