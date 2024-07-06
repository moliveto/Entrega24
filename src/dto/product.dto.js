import { body } from "express-validator";
import { mappingValidateMdw } from "../middleware/mapping-validation.middleware.js";

export const createProductDTO = [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number"),
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