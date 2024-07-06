import producModel from "../models/product.model.js";
import { generateProduct } from "../seed/generate-products.js";

export default class Products {

    get = (params) => {
        return producModel.find(params);
    }

    getBy = (params) => {
        return producModel.findOne(params);
    }

    save = (doc) => {
        return producModel.create(doc);
    }

    update = (id, doc) => {
        return producModel.findByIdAndUpdate(id, { $set: doc })
    }

    delete = (id) => {
        return producModel.findByIdAndDelete(id);
    }

    seed = async () =>{
        try {
            let products = [];
            const MAX_Products = 200;
            for (let index = 0; index < MAX_Products; index++) {
                let product = generateProduct();
                console.log("🚀 ~ Products ~ Seed ~ product:", product)
                products.push(product);
            }
            console.log("🚀 ~ Products ~ Seed ~ products:", products)
            const result = await producModel.insertMany(products);
            return result;
        } catch (error) {
            throw new Error(`Error en insersion masiva de productos ${error}`);
        }
    }
}