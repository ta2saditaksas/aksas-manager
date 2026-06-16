const express = require('express');
const router = express.Router();
const { getCommandes, getCommande, createCommande, updateCommande, ajouterPaiement } = require('../controllers/commandeController');

router.get('/', getCommandes);
router.get('/:id', getCommande);
router.post('/', createCommande);
router.put('/:id', updateCommande);
router.post('/:id/paiements', ajouterPaiement);

module.exports = router;