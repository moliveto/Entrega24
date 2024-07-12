import { Router } from 'express';
import chatController from '../../controllers/views/chat.controller.js';
import { handlePolicies } from '../../middleware/auth.middleware.js';
import userAuthAndSetup from '../../middleware/userAuthAndSetup.js';

const router = Router();

router.get('/', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, chatController.getMessages);
//router.get('/personal', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, chatController.getMyMessages);
//router.post('/', handlePolicies(["public", "user", "admin", "premium"]), userAuthAndSetup, chatController.addMessage);

export default router;