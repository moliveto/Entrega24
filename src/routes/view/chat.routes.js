import { Router } from 'express';
import chatController from '../../controllers/views/chat.controller.js';
import { authorizationMdw, authorizationMdwRol } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), chatController.getMessages);
//router.get('/personal', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), userAuthAndSetup, chatController.getMyMessages);
//router.post('/', authorizationMdw("jwt"), authorizationMdwRol(["public", "user", "admin", "premium"]), userAuthAndSetup, chatController.addMessage);

export default router;