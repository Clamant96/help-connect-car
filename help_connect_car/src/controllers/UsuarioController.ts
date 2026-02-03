import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class UsuarioController {
  // Criar usuário
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      var senhaCriptografada = '';
      const { nome, username, senha } = req.body;

      // Verificar se username já existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username já cadastrado' });
      }

      try {
        const salt = await bcrypt.genSalt(10);
        senhaCriptografada = await bcrypt.hash(senha, salt);
      } catch (error: any) {
        console.log('Erro ao criptografar senha:', error);
        senhaCriptografada = senha
      }

      console.log('senhaCriptografada: ', senhaCriptografada);

      const user = await User.create({
        nome,
        username,
        senha: senhaCriptografada,
        historico_reserva: [],
      });

      const userResponse = user.toObject();
      userResponse.senha = ''; // zera a senha para retornar no endpoint apos o cadastro

      return res.status(201).json(userResponse);
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Erro ao criar usuário', 
        details: error.message 
      });
    }
  }

  // Listar todos os usuários
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find().select('-senha');
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  // Buscar usuário por ID
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-senha');

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  // Atualizar usuário
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { nome, username } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { nome, username },
        { new: true, runValidators: true }
      ).select('-senha');

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username já está em uso' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  // Deletar usuário
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verificar se usuário tem reserva ativa
      const user = await User.findById(id);
      if (user?.reserva) {
        return res.status(400).json({ 
          error: 'Não é possível deletar usuário com reserva ativa' 
        });
      }

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default new UsuarioController();