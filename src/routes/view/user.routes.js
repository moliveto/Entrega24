import { Router } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';
import userController from '../../controllers/views/users.controller.js';
import { ValidateSignup } from '../../middleware/validator.js';
import uploaderAvatar from '../../utils/uploaderAvatar.js';
import { authorizationMdw, authorizationMdwRol } from '../../middleware/auth.middleware.js';

const router = Router();

// Login
router.get('/', userController.login);
router.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin', failureFlash: true, session: true }), userController.loginUser);
router.get('/faillogin', userController.failLogin);

// get users
router.get('/users', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), userController.users);
// create user
router.post('/users', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), userController.createUser);

// get user by id
router.get('/users/update/:id', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), userController.getUserById);
// update user by id
router.post('/users/update/:id?', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), userController.updateUser);

// delete user
router.post('/users/delete', authorizationMdw("jwt"), authorizationMdwRol(["admin"]), userController.deleteUser);

// Render Signup
router.get('/signup', userController.signup);

// Post Signup
router.post('/signup', uploaderAvatar.single('avatar'), ValidateSignup(), function (req, res, next) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("pages/signup.hbs", { errors: errors.array() });
    } else {
        passport.authenticate('signup',
            {
                successRedirect: '/products',
                successFlash: true,
                failureRedirect: '/failsignup',
                failureFlash: true,
                session: false,
            })(req, res, next);
    }

}, userController.signupUser);

// Fail Signup
router.get('/failSignup', userController.failSignup);

// Logout
router.get('/logout', userController.logout);

// Render Profile
router.get("/profile", authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), userController.profileUser);

// Render Forgot
router.get('/forgot', userController.forgot);
// Render Update Password
router.get('/updatepassword/:token', userController.updatepassword);

// Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => { }
);

//Iniciar session Github
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), userController.loginGithub);

export default router;