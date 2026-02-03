import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  userId: string;
  username: string;
  nome: string;
  iat?: number;
  exp?: number;
}

class JWTUtil {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret_fallback_dev_only_change_this_in_production';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback_dev_only_change_this_in_production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    
    // Validação em produção
    if (process.env.NODE_ENV === 'production') {
      if (this.secret.includes('fallback')) {
        throw new Error('JWT_SECRET must be set in production environment');
      }
      if (this.refreshSecret.includes('fallback')) {
        throw new Error('JWT_REFRESH_SECRET must be set in production environment');
      }
    }
  }

  // Gerar token de acesso
  generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: Number(this.expiresIn.replace('h', '')) * 3600, // Converter horas para segundos
      algorithm: 'HS256',
    };
    
    return jwt.sign(payload, this.secret, options);
  }

  // Gerar refresh token
  generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: Number(this.refreshExpiresIn.replace('d', '')) * 86400, // Converter dias para segundos
      algorithm: 'HS256',
    };
    
    return jwt.sign(payload, this.refreshSecret, options);
  }

  // Verificar token de acesso
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
      };
      
      const decoded = jwt.verify(token, this.secret, options);
      return decoded as JwtPayload;
    } catch (error) {
      console.error('Erro na verificação do access token:', error);
      return null;
    }
  }

  // Verificar refresh token
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
      };
      
      const decoded = jwt.verify(token, this.refreshSecret, options);
      return decoded as JwtPayload;
    } catch (error) {
      console.error('Erro na verificação do refresh token:', error);
      return null;
    }
  }

  // Decodificar token sem verificar (apenas para info)
  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token);
      
      if (decoded && typeof decoded === 'object') {
        return decoded as JwtPayload;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Gerar ambos tokens (access + refresh)
  generateTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    // Calcular tempo de expiração em segundos
    let expiresIn = 86400; // Default 24h em segundos
    
    try {
      const decoded = this.decodeToken(accessToken);
      if (decoded && decoded.exp && decoded.iat) {
        expiresIn = decoded.exp - decoded.iat;
      }
    } catch (error) {
      console.warn('Não foi possível calcular expiresIn, usando valor padrão');
    }

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  // Verificar se token está prestes a expirar (útil para refresh automático)
  isTokenExpiringSoon(token: string, thresholdMinutes: number = 15): boolean {
    try {
      const decoded = this.decodeToken(token);
      
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = decoded.exp;
      const thresholdSeconds = thresholdMinutes * 60;
      
      return (expiresAt - now) < thresholdSeconds;
    } catch (error) {
      return true;
    }
  }

  // Extrair token do header Authorization
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.split(' ')[1];
  }
}

export default new JWTUtil();