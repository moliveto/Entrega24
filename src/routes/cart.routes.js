import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';

const router = Router();

router.post("/", cartController.addCartCtrl)
router.get("/:cid", cartController.getCartProductsCtrl)
router.post("/:cid/product/:pid", cartController.addProductToCartCtrl)
router.delete("/:cid/product/:pid", cartController.deleteProductCartCtrl)
router.put("/:cid/product/:pid", cartController.editProductQuantityCtrl)
router.delete("/:cid", cartController.deleteAllCartProductsCtrl)

export default router;