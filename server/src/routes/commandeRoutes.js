const express = require('express');
const router = express.Router();
const {
  getCommandes,
  getCommande,
  createCommande,
  updateCommande,
  deleteCommande
} = require('../controllers/commandeController');

router.get('/', getCommandes);
router.get('/:id', getCommande);
router.post('/', createCommande);
router.put('/:id', updateCommande);
router.delete('/:id', deleteCommande);

module.exports = router;