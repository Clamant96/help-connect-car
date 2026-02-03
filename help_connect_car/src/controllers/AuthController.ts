import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import JWTUtil from '../util/JWTUtil';
import bcrypt from 'bcryptjs';

class AuthController {
  // Registrar novo usuário
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, username, senha } = req.body;

      // Validações básicas
      if (!nome || !username || !senha) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          message: 'Nome, username e senha são obrigatórios'
        });
      }

      // Verificar se username já existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Username já cadastrado',
          message: 'Escolha outro username'
        });
      }

      let senhaCriptografada = senha;
      try {
        const salt = await bcrypt.genSalt(10);
        senhaCriptografada = await bcrypt.hash(senha, salt);
      } catch (error: any) {
        console.log('Erro ao criptografar senha:', error);
        senhaCriptografada = senha
      }

      // Criar usuário
      const user = await User.create({
        nome,
        username,
        senha: senhaCriptografada,
        historico_reserva: [],
      });

      // Gerar tokens
      const tokens = JWTUtil.generateTokens({
        userId: user._id.toString(),
        username: user.username,
        nome: user.nome,
      });

      // Retornar usuário sem senha + tokens
      const userResponse = user.toJSON();
      
      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: userResponse,
        auth: {
          ...tokens,
          tokenType: 'Bearer'
        }
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ 
          error: 'Erro de validação',
          messages 
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao registrar usuário',
        details: error.message 
      });
    }
  }

  // Login
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, senha } = req.body;

      // Validações
      if (!username || !senha) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          message: 'Username e senha são obrigatórios'
        });
      }

      // Buscar usuário com senha (select: false no modelo, então precisamos explicitamente)
      const user = await User.findOne({ username }).select('+senha');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas',
          message: 'Usuário não encontrado'
        });
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(senha);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas',
          message: 'Senha incorreta'
        });
      }

      // Gerar tokens
      const tokens = JWTUtil.generateTokens({
        userId: user._id.toString(),
        username: user.username,
        nome: user.nome,
      });

      // Atualizar último login (opcional)
      // await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      // Retornar usuário sem senha + tokens
      const userResponse = user.toJSON();
      
      return res.json({
        message: 'Login realizado com sucesso',
        user: userResponse,
        auth: {
          ...tokens,
          tokenType: 'Bearer'
        }
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      return res.status(500).json({ 
        error: 'Erro no login',
        details: error.message 
      });
    }
  }

  // Meu perfil (usuário autenticado)
  public async me(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({
        user: user.toJSON(),
        auth: {
          userId: req.user.userId,
          username: req.user.username,
          nome: req.user.nome,
        }
      });
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Erro ao buscar perfil',
        details: error.message 
      });
    }
  }

  // Refresh token
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token não fornecido' 
        });
      }

      // Verificar refresh token
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      
      if (!decoded) {
        return res.status(401).json({ 
          error: 'Refresh token inválido ou expirado' 
        });
      }

      // Verificar se usuário ainda existe
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Gerar novos tokens
      const tokens = JWTUtil.generateTokens({
        userId: user._id.toString(),
        username: user.username,
        nome: user.nome,
      });

      return res.json({
        message: 'Token renovado com sucesso',
        auth: {
          ...tokens,
          tokenType: 'Bearer'
        }
      });
    } catch (error: any) {
      console.error('Erro no refresh token:', error);
      return res.status(500).json({ 
        error: 'Erro ao renovar token',
        details: error.message 
      });
    }
  }

  // Logout (opcional - normalmente é feito no frontend apenas)
  public async logout(req: AuthRequest, res: Response): Promise<Response> {
    try {
      // Em um sistema mais complexo, você pode:
      // 1. Adicionar token a uma blacklist
      // 2. Invalidar refresh token
      // 3. Limpar cookies/session
      
      return res.json({ 
        message: 'Logout realizado com sucesso',
        note: 'Para logout completo, remova o token no cliente'
      });
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Erro no logout',
        details: error.message 
      });
    }
  }

  // Mudar senha
  public async changePassword(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Dados incompletos',
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'Senha muito curta',
          message: 'A nova senha deve ter pelo menos 6 caracteres'
        });
      }

      // Buscar usuário com senha
      const user = await User.findById(userId).select('+senha');
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar senha atual
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ 
          error: 'Senha atual incorreta' 
        });
      }

      // Atualizar senha
      user.senha = newPassword;
      await user.save();

      return res.json({ 
        message: 'Senha alterada com sucesso' 
      });
    } catch (error: any) {
      console.error('Erro ao mudar senha:', error);
      return res.status(500).json({ 
        error: 'Erro ao alterar senha',
        details: error.message 
      });
    }
  }
}

export default new AuthController();