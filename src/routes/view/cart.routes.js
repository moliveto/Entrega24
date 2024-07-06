import { Router } from 'express';
import cartController from '../../controllers/cart.controller.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', handlePolicies(["public", "user", "admin", "premium"]), cartController.getCart);
router.post('/add', handlePolicies(["public", "user", "admin", "premium"]), cartController.addProductToCart);
router.post('/removeProduct', handlePolicies(["public", "user", "admin", "premium"]), cartController.removeProductFromCart);
router.post('/cleanCart', handlePolicies(["public", "user", "admin", "premium"]), cartController.cleanCart);

export default router;