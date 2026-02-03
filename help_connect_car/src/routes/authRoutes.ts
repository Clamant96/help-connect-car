import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Rotas públicas
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh-token', AuthController.refreshToken);

// Rotas protegidas (requerem autenticação)
router.get('/auth/me', authenticate, AuthController.me);
router.post('/auth/logout', authenticate, AuthController.logout);
router.post('/auth/change-password', authenticate, AuthController.changePassword);

export default router;