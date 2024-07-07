import { Router } from 'express';
import userRouter from './user.routes.js';
import productRouter from './product.routes.js';
import cartRouter from './cart.routes.js';
import orderRouter from './order.routes.js';

const router = Router();

router.use("/", userRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);

export default router;