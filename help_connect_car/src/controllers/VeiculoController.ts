import { Request, Response } from 'express';
import Veiculo from '../models/Veiculo';

class VeiculoController {
  // Criar veículo
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, year, type, engine, size } = req.body;

      const veiculo = await Veiculo.create({
        name,
        year,
        type,
        engine,
        size,
        disponivel: true,
      });

      return res.status(201).json(veiculo);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Veículo já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro ao criar veículo', details: error.message });
    }
  }

  public async createAll(req: Request, res: Response): Promise<Response> {
    try {
        const veiculos = await Veiculo.create(req.body);
      
        return res.status(201).json(veiculos);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Veículo já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro ao criar veículo', details: error.message });
    }
  }

  // Listar todos os veículos
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const veiculos = await Veiculo.find();
      return res.json(veiculos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
  }

  // Buscar veículo por ID
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findById(id);

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      return res.json(veiculo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }

  // Atualizar veículo
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, year, type, engine, size, disponivel } = req.body;

      const veiculo = await Veiculo.findByIdAndUpdate(
        id,
        { name, year, type, engine, size, disponivel },
        { new: true, runValidators: true }
      );

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      return res.json(veiculo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
  }

  // Deletar veículo
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByIdAndDelete(id);

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      return res.json({ message: 'Veículo deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar veículo' });
    }
  }
}

export default new VeiculoController();