import { Router } from 'express';
import userController from '../../controllers/views/users.controller.js';
import { ValidateSignup } from '../../middleware/validator.js';
import uploaderAvatar from '../../utils/uploaderAvatar.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';

const router = Router();

// Login
router.get('/', userController.login);
router.get('/users', handlePolicies(["admin"]), userController.users);
router.post('/users', handlePolicies(["admin"]), userController.createUser);
router.get('/users/update/:id', handlePolicies(["admin"]), userController.getUserById);
router.post('/users/update/:id?', handlePolicies(["admin"]), userController.updateUser);
router.post('/users/delete', handlePolicies(["admin"]), userController.deleteUser);
router.post("/login", userController.logon);
router.get('/faillogin', userController.failLogin);

// Signup
router.get('/signup', userController.signup);
router.post('/signup', uploaderAvatar.single('avatar'), ValidateSignup(), userController.signon);
router.get('/failSignup', userController.failSignup);

// Logout
router.get('/logout', userController.logout);

// Profile
router.get("/profile", handlePolicies(["public", "user", "admin", "premium"]), userController.profileUser);

// Forgot
router.get('/forgot', userController.forgot);
router.get('/updatepassword/:token', userController.updatepassword);

export default router;