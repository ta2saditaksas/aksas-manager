const prisma = require('../config/prisma');

// Lister tous les stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Voir un stock
const getStock = async (req, res) => {
  try {
    const stock = await prisma.stock.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!stock) return res.status(404).json({ error: 'Stock introuvable' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un stock
const createStock = async (req, res) => {
  try {
    const { designation, quantite, unite, seuilAlerte } = req.body;
    if (!designation || quantite === undefined || !unite) {
      return res.status(400).json({ error: 'Désignation, quantité et unité obligatoires' });
    }
    const stock = await prisma.stock.create({
      data: { designation, quantite: parseFloat(quantite), unite, seuilAlerte: parseFloat(seuilAlerte) || 0 }
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un stock
const updateStock = async (req, res) => {
  try {
    const { designation, quantite, unite, seuilAlerte } = req.body;
    const stock = await prisma.stock.update({
      where: { id: parseInt(req.params.id) },
      data: { designation, quantite: parseFloat(quantite), unite, seuilAlerte: parseFloat(seuilAlerte) }
    });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un stock
const deleteStock = async (req, res) => {
  try {
    await prisma.stock.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Stock supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getStocks, getStock, createStock, updateStock, deleteStock };