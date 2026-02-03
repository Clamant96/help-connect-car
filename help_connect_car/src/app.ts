import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import veiculoRoutes from './routes/veiculoRoutes';
import reservaRoutes from './routes/reservaRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

// Configurar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.use('/api', authRoutes);

// Rotas
app.use('/api', usuarioRoutes);
app.use('/api', veiculoRoutes);
app.use('/api', reservaRoutes);

// Rotas de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    authentication: 'JWT',
    endpoints: {
      public: ['/api/auth/register', '/api/auth/login', '/api/veiculo'],
      protected: ['/api/usuario', '/api/reserva', '/api/veiculo (POST, PUT, DELETE)']
    }
  });
});

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;