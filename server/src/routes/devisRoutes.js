const express = require('express');
const router = express.Router();
const { getDevis, getUnDevis, createDevis, updateStatutDevis } = require('../controllers/devisController');

router.get('/', getDevis);
router.get('/:id', getUnDevis);
router.post('/', createDevis);
router.put('/:id/statut', updateStatutDevis);

module.exports = router;
