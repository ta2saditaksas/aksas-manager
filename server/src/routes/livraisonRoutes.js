const express = require('express');
const router = express.Router();
const { getLivraisons, createLivraison, getLivraison } = require('../controllers/livraisonController');

router.get('/', getLivraisons);
router.get('/:id', getLivraison);
router.post('/', createLivraison);

module.exports = router;