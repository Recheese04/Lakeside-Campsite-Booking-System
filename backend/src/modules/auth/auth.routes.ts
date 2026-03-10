import { Router } from 'express';
import * as authController from './auth.controller';
import { validateLogin } from './auth.middleware';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.post('/register', authController.register);

export default router;
