import cartModel from "../models/carts.model.js";

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
}