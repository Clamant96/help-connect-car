import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { authenticate, requireSelfOrAdmin } from '../middlewares/auth';

const router = Router();

// Rotas de usuário
// router.post('/usuario', authenticate, requireSelfOrAdmin, UsuarioController.create);
router.put('/usuario/:id', authenticate, requireSelfOrAdmin, UsuarioController.update);
router.delete('/usuario/:id', authenticate, requireSelfOrAdmin, UsuarioController.delete);
router.get('/usuario/:id', authenticate, requireSelfOrAdmin, UsuarioController.getById);
router.get('/usuario', authenticate, requireSelfOrAdmin, UsuarioController.getAll);

export default router;