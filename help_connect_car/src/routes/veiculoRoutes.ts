import { Router } from 'express';
import VeiculoController from '../controllers/VeiculoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // todas as rodas precisam de autenticacao

// Rotas de veículo
router.post('/veiculo', VeiculoController.create);
router.post('/veiculos', VeiculoController.createAll);
router.put('/veiculo/:id', VeiculoController.update);
router.delete('/veiculo/:id', VeiculoController.delete);
router.get('/veiculo/:id', VeiculoController.getById);
router.get('/veiculo', VeiculoController.getAll);
router.get('/veiculos/nome/:nome', VeiculoController.getByNome);
router.post('/veiculos/filtro', VeiculoController.getByFilter);

export default router;