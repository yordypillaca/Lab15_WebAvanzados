const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticate, authorizeRoles('CUSTOMER', 'ADMIN'), productController.getAllProducts);
router.get('/:id', authenticate, authorizeRoles('CUSTOMER', 'ADMIN'), productController.getProductById);
router.post('/', authenticate, authorizeRoles('ADMIN'), productController.createProduct);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), productController.updateProduct);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;
