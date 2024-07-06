import cartModel from "../models/carts.model.js";
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export default class Carts {
    constructor() {
        this.model = cartModel;
    }

    get = (params) => {
        return cartModel.find(params);
    }

    getBy = (params) => {
        return cartModel.findOne(params);
    }

    save = (doc) => {
        return cartModel.create(doc);
    }

    update = (id, doc) => {
        return cartModel.findByIdAndUpdate(id, { $set: doc })
    }

    delete = (id) => {
        return cartModel.findByIdAndDelete(id);
    }

    addProductToCart = async (id, newCartProducts) => {
        try {
            const result = await cartModel.updateOne({ _id: id }, { $set: { products: newCartProducts } });
            return { status: 'success', message: `Producto agregado con exito al carrito. ${result}` };
        } catch (error) {
            return { status: 'error', message: `Error al agregar producto al carrito. ${error}` };
        }
    }

    removeProductFromCart = async (cartId, productId) => {
        try {
            const cartObjectId = new mongoose.Types.ObjectId(cartId);
            const productObjectId = new mongoose.Types.ObjectId(productId);
            const result = await cartModel.updateOne(
                { _id: cartObjectId },
                { $pull: { products: { product: productObjectId } } }
            );
            console.log("🚀 ~ Carts ~ removeProductFromCart= ~ result:", result)

            if (result.modifiedCount === 0) {
                throw new Error("Product not found in the cart.");
            }
            return { status: 'success', message: `Producto eliminado con exito del carrito. ${productId}` };
        } catch (error) {
            return { status: 'error', message: `Error al eliminar producto del carrito: ${error.message}` };
        }
    }

}