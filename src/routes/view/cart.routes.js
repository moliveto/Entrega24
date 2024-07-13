import { Router } from 'express';
import cartController from '../../controllers/views/cart.controller.js';
import { authorizationMdw, authorizationMdwRol } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), cartController.getCart);
router.post('/add', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), cartController.addProductToCart);
router.post('/removeProduct', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), cartController.removeProductFromCart);
router.post('/cleanCart', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), cartController.cleanCart);

export default router;