import { Router } from 'express';
import productController from '../../controllers/views/products.controller.js';
import { authorizationMdw, authorizationMdwRol } from '../../middleware/auth.middleware.js';
import { validateProduct } from '../../middleware/validator.js';

const router = Router();

router.get('/', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), productController.products);
router.get('/update/:id', authorizationMdw("jwt"), authorizationMdwRol(["admin", "premium"]), productController.getProductById);
router.post('/update/:id?', authorizationMdw("jwt"), authorizationMdwRol(["admin", "premium"]), validateProduct(), productController.updateProduct);
router.post('/delete', authorizationMdw("jwt"), authorizationMdwRol(['admin', 'premium']), productController.deleteProductAndRedirect);
router.post('/', authorizationMdw("jwt"), authorizationMdwRol(['admin', 'premium']), validateProduct(), productController.addProduct);

export default router;