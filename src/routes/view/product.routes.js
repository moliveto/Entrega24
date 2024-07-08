import { Router } from 'express';
import productController from '../../controllers/views/products.controller.js';
import { handlePolicies, productMdwPremium } from '../../middleware/auth.middleware.js';
import { validateProduct } from '../../middleware/validator.js';
import userAuthAndSetup from '../../middleware/userAuthAndSetup.js';

const router = Router();

router.get('/', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, productController.products);
router.get('/update/:id', handlePolicies(["admin", "premium"]), userAuthAndSetup, productController.getProductById);
router.post('/update/:id?', handlePolicies(["admin", "premium"]), userAuthAndSetup, validateProduct(), productController.updateProduct);
router.post('/delete', handlePolicies(['admin', 'premium']), userAuthAndSetup, productController.deleteProductAndRedirect);
router.post('/', handlePolicies(['admin', 'premium']), userAuthAndSetup, validateProduct(), productController.addProduct);

export default router;