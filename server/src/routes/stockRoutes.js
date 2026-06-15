const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  createStock,
  updateStock,
  deleteStock
} = require('../controllers/stockController');

router.get('/', getStocks);
router.get('/:id', getStock);
router.post('/', createStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

module.exports = router;