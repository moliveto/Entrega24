import { Router } from 'express';
import orderController from '../../controllers/views/order.controller.js';
import { authorizationMdw, authorizationMdwRol } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), orderController.getMyOrders);
router.get('/admin', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), orderController.getOrders);
router.post('/create', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), orderController.createOrder);

export default router;