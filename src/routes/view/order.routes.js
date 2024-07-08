import { Router } from 'express';
import orderController from '../../controllers/views/order.controller.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';
import userAuthAndSetup from '../../middleware/userAuthAndSetup.js';

const router = Router();

router.get('/admin', handlePolicies(["admin"]), userAuthAndSetup, orderController.getOrders);
router.post('/create', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, orderController.createOrder);

export default router;