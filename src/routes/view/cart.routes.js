import { Router } from 'express';
import cartController from '../../controllers/views/cart.controller.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';
import userAuthAndSetup from '../../middleware/userAuthAndSetup.js';

const router = Router();

router.get('/', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, cartController.getCart);
router.post('/add', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, cartController.addProductToCart);
router.post('/removeProduct', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, cartController.removeProductFromCart);
router.post('/cleanCart', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, cartController.cleanCart);

export default router;