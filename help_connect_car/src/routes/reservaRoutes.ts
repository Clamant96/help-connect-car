import { Router } from 'express';
import ReservaController from '../controllers/ReservaController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // todas as rodas precisam de autenticacao

// Rotas de reserva
router.post('/reserva', ReservaController.create); // Reservar veículo
router.post('/reserva/:id/finalizar', ReservaController.finalizarReserva); // Finalizar/Cancelar reserva
router.get('/reserva/usuario/:id', ReservaController.getByUsuario); // Histórico do usuário
router.get('/reserva', ReservaController.getAll); // Listar todas (admin)

export default router;