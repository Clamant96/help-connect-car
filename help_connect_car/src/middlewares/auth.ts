import { Request, Response, NextFunction } from 'express';
import JWTUtil from '../util/JWTUtil';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

// Middleware para verificar JWT
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Acesso não autorizado',
        message: 'Token de autenticação não fornecido'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = JWTUtil.verifyAccessToken(token);
    
    if (!decoded) {
      res.status(401).json({ 
        error: 'Acesso não autorizado',
        message: 'Token inválido ou expirado'
      });
      return;
    }

    // Adicionar usuário à requisição
    req.user = decoded;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ 
      error: 'Erro interno na autenticação' 
    });
  }
};

// Middleware para verificar se usuário é admin (se necessário)
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Exemplo: verificar se usuário tem role admin
  // Você pode adaptar conforme sua lógica de roles
  if (req.user && req.user.username === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Somente administradores podem acessar este recurso'
    });
  }
};

// Middleware para verificar se é o próprio usuário ou admin
export const requireSelfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.params.id;
  
  if (!req.user) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }

  // Se é admin ou o próprio usuário
  if (req.user.username === 'admin' || req.user.userId === userId) {
    next();
  } else {
    res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Você só pode acessar seus próprios dados'
    });
  }
};