import { Router } from 'express';
import { handlePolicies, productMdwPremium } from '../middleware/auth.middleware.js';
import { createProductDTO } from "../dto/product.dto.js";
import productsController from '../controllers/products.controller.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', handlePolicies(['admin', 'user', 'premium', 'public']), productsController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post('/', handlePolicies(['admin', 'premium']), createProductDTO, productsController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/:uid', handlePolicies('public'), productsController.getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update the product by the id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened in server
 */
router.put('/:uid', productMdwPremium, productsController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened in server
 */
router.delete('/:uid', productMdwPremium, productsController.deleteProduct);

/**
 * @swagger
 * /api/products/seed:
 *   get:
 *     summary: Seed the database
 *     description: This endpoint seeds the database with initial product data.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *       500:
 *         description: Error occurred while seeding the database
 */
router.get('/seed', productsController.Seed);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - quantity
 *         - thumbnail
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: number
 *           description: The quantity of the product in stock
 *         thumbnail:
 *           type: string
 *           description: The thumbnail image of the product
 *         status:
 *           type: boolean
 *           description: The status of the product
 *       example:
 *         name: "Coca cola"
 *         description: "Bebida cola"
 *         price: 101.1
 *         quantity: 55
 *         thumbnail: "cocacola.jpg"
 *         status: true
 */