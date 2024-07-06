import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { handlePolicies } from '../middleware/auth.middleware.js';
import uploader from '../utils/uploader.js';
import { ValidateSignup } from '../middleware/validator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: the auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: the first name of the user
 *         last_name:
 *           type: string
 *           description: the last name of the user
 *         email:
 *           type: string
 *           description: the email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         Role:
 *           type: string
 *           description: The role of the user
 *       example:
 *         first_name: Juan 
 *         last_name: Perez
 *         email: juan@gmail.com
 *         password: 12345
 *         role: admin
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener todos los usuarios
 *     description: Obtiene todos los usuarios registrados en la base de datos
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Register a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.post('/', ValidateSignup(), usersController.createUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     description: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.delete('/:uid', usersController.deleteUser);

/**
* @swagger
* /api/users/forgotpassword:
*   post:
*      tags:
*        - Users
*      summary: Initiates the password reset process for a user
*      description: Allows a user to request a password reset link. The user must provide their registered email address to receive the password reset instructions.
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              required:
*                - email
*              properties:
*                email:
*                  type: string
*                  format: email
*                  description: The user's email address.
*      responses:
*        '200':
*          description: Password reset email sent successfully.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                    example: Password reset email has been sent.
*        '400':
*          description: Bad request, such as missing email parameter.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Email is required.
*        '404':
*          description: User not found with the provided email.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: User not found.
*        '500':
*          description: Internal server error.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: An error occurred while processing the request.
*/
router.post("/resetpassword", usersController.forgotPassword);

router.post("/updatePassword", usersController.updatePassword);

/**
 * @swagger
 * /api/users/premium/{uid}:
 *   post:
 *     summary: Upgrade a user to premium status.
 *     description: This endpoint upgrades the user identified by uid to premium status, granting them access to premium features.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to be upgraded.
 *     responses:
 *       '200':
 *         description: User successfully upgraded to premium.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User upgraded to premium successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12345
 *                     status:
 *                       type: string
 *                       example: premium
 *       '400':
 *         description: Bad request, such as invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user ID.
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while upgrading the user.
 */
router.post("/premium/:uid", handlePolicies(['admin']), usersController.togglePremiumCtrl)

/**
 * @swagger
 * /upload/{uid}:
 *   post:
 *     summary: Uploads a document for a specific user.
 *     description: Allows uploading a document file for the user identified by uid. This endpoint is typically used to upload necessary documentation for user accounts.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *       - in: formData
 *         name: documentation
 *         type: file
 *         required: true
 *         description: The document file to upload.
 *     responses:
 *       '200':
 *         description: Document uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Document uploaded successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       example: document.pdf
 *                     filePath:
 *                       type: string
 *                       example: /uploads/documents/document.pdf
 *       '400':
 *         description: Bad request, such as missing file or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing document file.
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the request.
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 */
router.post("/upload/:uid", uploader.single('documentation'), usersController.uploadDocumentCtrl)

export default router;