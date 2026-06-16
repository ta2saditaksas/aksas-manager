const prisma = require('../config/prisma');

const genererReference = async () => {
  const annee = new Date().getFullYear().toString().slice(-2);
  const count = await prisma.livraison.count();
  const num = String(count + 1).padStart(4, '0');
  return `LIV-${num}-${annee}`;
};

const getLivraisons = async (req, res) => {
  try {
    const livraisons = await prisma.livraison.findMany({
      include: { commande: { include: { client: true } }, lignes: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(livraisons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLivraison = async (req, res) => {
  try {
    const { commandeId, lignes, notes, dateLivraison } = req.body;
    if (!commandeId || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Commande et articles obligatoires' });
    }

    const reference = await genererReference();

    const livraison = await prisma.livraison.create({
      data: {
        reference,
        commandeId: parseInt(commandeId),
        notes,
        dateLivraison: dateLivraison ? new Date(dateLivraison) : new Date(),
        lignes: {
          create: lignes.map(l => ({
            ligneCommandeId: parseInt(l.ligneCommandeId),
            quantiteLivree: parseFloat(l.quantiteLivree)
          }))
        }
      },
      include: { lignes: true }
    });

    for (const l of lignes) {
      await prisma.ligneCommande.update({
        where: { id: parseInt(l.ligneCommandeId) },
        data: {
          quantiteLivree: {
            increment: parseFloat(l.quantiteLivree)
          }
        }
      });
    }

    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(commandeId) },
      include: { lignes: true }
    });

    const toutLivre = commande.lignes.every(l => l.quantiteLivree >= l.quantite);
    const partiellemntLivre = commande.lignes.some(l => l.quantiteLivree > 0);

    await prisma.commande.update({
      where: { id: parseInt(commandeId) },
      data: {
        statut: toutLivre ? 'livree' : partiellemntLivre ? 'partiellement_livree' : 'en_cours'
      }
    });

    res.status(201).json(livraison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLivraison = async (req, res) => {
  try {
    const livraison = await prisma.livraison.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        commande: { include: { client: true, lignes: true } },
        lignes: true
      }
    });
    if (!livraison) return res.status(404).json({ error: 'Livraison introuvable' });
    res.json(livraison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLivraisons, createLivraison, getLivraison };