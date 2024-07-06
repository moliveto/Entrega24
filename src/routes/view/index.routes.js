import { Router } from 'express';
import userRouter from './user.routes.js';
import productRouter from './product.routes.js';
import cartRouter from './cart.routes.js';

const router = Router();

router.use("/", userRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);

export default router;