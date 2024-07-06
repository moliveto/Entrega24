import { Router } from 'express';
import productController from '../../controllers/views/products.controller.js';
import { handlePolicies, productMdwPremium } from '../../middleware/auth.middleware.js';
import { validateProduct } from '../../middleware/validator.js';

const router = Router();

router.get('/', handlePolicies(["public", "user", "admin", "premium"]), productController.products);
router.get('/update/:id', handlePolicies(["admin", "premium"]), productController.getProductById);
router.post('/update/:id?', handlePolicies(["admin", "premium"]), validateProduct(), productController.updateProduct);
router.post('/delete', handlePolicies(['admin', 'premium']), productController.deleteProductAndRedirect);
router.post('/', handlePolicies(['admin', 'premium']), validateProduct(), productController.addProduct);

export default router;