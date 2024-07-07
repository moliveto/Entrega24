import { Router } from 'express';
import orderController from '../../controllers/views/order.controller.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';

const router = Router();

//router.get('/', handlePolicies(["public", "user", "admin", "premium"]), orderController.getOrders);
router.post('/create', handlePolicies(["public", "user", "admin", "premium"]), orderController.createOrder);

export default router;
