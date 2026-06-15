const express = require('express');
const router = express.Router();
const {
  getPaiements,
  getPaiement,
  createPaiement,
  updatePaiement,
  deletePaiement
} = require('../controllers/paiementController');

router.get('/', getPaiements);
router.get('/:id', getPaiement);
router.post('/', createPaiement);
router.put('/:id', updatePaiement);
router.delete('/:id', deletePaiement);

module.exports = router;