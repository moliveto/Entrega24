import { body } from "express-validator";
import { mappingValidateMdw } from "../middleware/mapping-validation.middleware.js";

export class ProductDTO{
    constructor (product, quantity = 1){
        this.id = product._id.toString() || product.id
        this.name = product.name
        this.description = product.description
        this.price = product.price
        this.thumbnail = product.thumbnail
        this.category = product.category
        this.stock = product.stock
        this.createdAt = product.createdAt
        this.quantity = quantity
    }
}

export const createProductDTO = [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),
    body("stock")
        .notEmpty()
        .withMessage("stock is required")
        .isNumeric()
        .withMessage("stock must be a number"),
    body("thumbnail")
        .optional()
        .isURL()
        .withMessage("Thumbnail must be a valid URL"),
    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be a boolean"),
    mappingValidateMdw,
];