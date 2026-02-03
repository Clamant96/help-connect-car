import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';

const router = Router();

// Rotas de usuário
router.post('/usuario', UsuarioController.create);
router.put('/usuario/:id', UsuarioController.update);
router.delete('/usuario/:id', UsuarioController.delete);
router.get('/usuario/:id', UsuarioController.getById);
router.get('/usuario', UsuarioController.getAll);

export default router;