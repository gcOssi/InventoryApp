const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsAPI,
  createProductAPI
} = require('../controllers/productController');

// Rutas web
router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// API routes
router.get('/api/products', getProductsAPI);
router.post('/api/products', createProductAPI);

module.exports = router;