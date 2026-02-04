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
      const veiculos = await Veiculo.find({ disponivel: true });
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

  // Buscar veículo por nome
  public async getByNome(req: Request, res: Response): Promise<Response> {
    try {
      const { nome } = req.params;
      const nomeString = nome as string; // Cast para string
      
      const veiculos = await Veiculo.find({ 
        name: { 
          $regex: nomeString, 
          $options: 'i' // Adicione isso para case-insensitive
        } 
      });

      if (veiculos.length === 0) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      return res.json(veiculos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }

  public async getByFilter(req: Request, res: Response): Promise<Response> {
    try {
      // Obter os parâmetros da query string
      const { name, type, engine, size } = req.body;

      const nomeString = name as string; // Cast para string

      // Criar objeto de filtro
      const filter: any = { disponivel: true };

      // Verifica se existe filtros aplicados
      const hasFilters = name && name != "" && name != null && name != undefined || type && type?.length > 0 || engine && engine?.length > 0 || size && size?.length > 0;

      // Caso nao se tenha filtros, retorna o endpoint get all veiculos 
      if (!hasFilters) {
        const veiculos = await Veiculo.find(filter);
        
        if (veiculos.length === 0) {
          return res.status(500).json({ error: 'Erro ao buscar veículos' });
        }
        
        return res.json(veiculos);
      }

      if(name && name != "" && name != null && name != undefined) {
        filter.name = { 
          $regex: nomeString, 
          $options: 'i' // Adicione isso para case-insensitive
        };
      }

      // Filtro por type (tipo de carroceria)
      if (type && type?.length > 0) {
        // Se type for uma string (único valor ou lista separada por vírgulas)
        const typeArray = Array.isArray(type) 
          ? type 
          : (type as string).split(',').map(t => t.trim());
        
        filter.type = { $in: typeArray };
      }
      
      // Filtro por engine (qtd de cavalos)
      if (engine && engine?.length > 0) {
        const engineArray = Array.isArray(engine) 
          ? engine 
          : (engine as string).split(',').map(e => e.trim());
        
        filter.engine = { $in: engineArray };
      }
      
      // Filtro por size (qtd lugares)
      if (size && size?.length > 0) {
        const sizeArray = Array.isArray(size) 
          ? size.map(s => Number(s)) 
          : (size as string).split(',').map(s => Number(s.trim()));
        
        filter.size = { $in: sizeArray };
      }

      console.log('filter: ', filter);
      
      // Executar a consulta
      const veiculos = await Veiculo.find(filter);
      
      if (veiculos.length === 0) {
        return res.status(404).json({ 
          error: 'Nenhum veículo encontrado com os filtros aplicados',
          filters: filter 
        });
      }
      
      return res.json(veiculos);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      return res.status(500).json({ error: 'Erro ao buscar veículos' });
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