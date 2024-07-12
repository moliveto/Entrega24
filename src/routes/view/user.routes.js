import { Router } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';
import userController from '../../controllers/views/users.controller.js';
import { ValidateSignup } from '../../middleware/validator.js';
import uploaderAvatar from '../../utils/uploaderAvatar.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';
import userAuthAndSetup from '../../middleware/userAuthAndSetup.js';

const router = Router();

// Login
router.get('/', userAuthAndSetup, userController.login);
router.get('/users', handlePolicies(["admin"]), userAuthAndSetup, userController.users);
router.post('/users', handlePolicies(["admin"]), userAuthAndSetup, userController.createUser);
router.get('/users/update/:id', handlePolicies(["admin"]), userAuthAndSetup, userController.getUserById);
router.post('/users/update/:id?', handlePolicies(["admin"]), userAuthAndSetup, userController.updateUser);
router.post('/users/delete', handlePolicies(["admin"]), userController.deleteUser);
//router.post("/login", userController.logon);
router.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin', failureFlash: true, session: true }), userController.loginUser);
router.get('/faillogin', userController.failLogin);

// Signup
router.get('/signup', userAuthAndSetup, userController.signup);
//router.post('/signup', userAuthAndSetup, uploaderAvatar.single('avatar'), ValidateSignup(), userController.signon);
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

router.get('/failSignup', userAuthAndSetup, userController.failSignup);

// Logout
router.get('/logout', userAuthAndSetup, userController.logout);

// Profile
router.get("/profile", handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, userController.profileUser);

// Forgot
router.get('/forgot', userAuthAndSetup, userController.forgot);
router.get('/updatepassword/:token', userAuthAndSetup, userController.updatepassword);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => { }
);

// router.get("/github/callback",
//     passport.authenticate("github", { failureRedirect: "/login" }),
//     async (req, res) => {
//         try {
//             req.session.user = req.user;
//             res.redirect("/profile");
//         } catch (error) {
//             console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
//         }
//     }
// );

//Iniciar session Github
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), userController.loginGithub);

export default router;