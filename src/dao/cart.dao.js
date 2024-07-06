import cartModel from "../models/carts.model.js";

export default class Carts {

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
}