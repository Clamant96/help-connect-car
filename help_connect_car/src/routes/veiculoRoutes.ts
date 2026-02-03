import { Router } from 'express';
import VeiculoController from '../controllers/VeiculoController';

const router = Router();

// Rotas de veículo
router.post('/veiculo', VeiculoController.create);
router.post('/veiculos', VeiculoController.createAll);
router.put('/veiculo/:id', VeiculoController.update);
router.delete('/veiculo/:id', VeiculoController.delete);
router.get('/veiculo/:id', VeiculoController.getById);
router.get('/veiculo', VeiculoController.getAll);

export default router;