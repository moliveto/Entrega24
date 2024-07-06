import { cartService } from "../services/index.js"

const getAllCartsCtrl = async (req, res) => {
    const carts = await cartService.getAll();
    res.send({ status: "success", message: "Carts found", payload: carts })
}

const addCartCtrl = async (req, res) => {
    const cart = req.body;
    const newcart = await cartService.create(cart);
    res.send({ status: "success", message: "Cart created", payload: newcart })
}

export default {
    getAllCartsCtrl,
    addCartCtrl
}