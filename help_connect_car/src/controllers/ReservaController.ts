import { Request, Response } from 'express';
import Reserva from '../models/Reserva';
import Veiculo from '../models/Veiculo';
import User from '../models/User';

class ReservaController {
  // Criar reserva (reservar veículo)
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { usuarioId, veiculoId } = req.body;

      // Verificar se usuário existe
      const usuario = await User.findById(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar se usuário já tem uma reserva ativa
      if (usuario.reserva) {
        return res.status(400).json({ error: 'Usuário já possui uma reserva ativa' });
      }

      // Verificar se veículo existe
      const veiculo = await Veiculo.findById(veiculoId);
      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      // Verificar se veículo está disponível
      if (!veiculo.disponivel) {
        return res.status(400).json({ error: 'Veículo não está disponível' });
      }

      // Criar reserva
      const reserva = await Reserva.create({
        usuario: usuarioId,
        veiculo: veiculoId,
        status: 'ativa',
        data_reserva: new Date(),
      });

      // Atualizar veículo para indisponível
      await Veiculo.findByIdAndUpdate(veiculoId, { disponivel: false });

      // Atualizar usuário com a reserva ativa
      await User.findByIdAndUpdate(usuarioId, {
        reserva: reserva._id,
        $push: { historico_reserva: reserva._id }
      });

      // Popular os dados antes de retornar
      const reservaCompleta = await Reserva.findById(reserva._id)
        .populate('usuario', '-senha')
        .populate('veiculo');

      return res.status(201).json(reservaCompleta);
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Erro ao criar reserva', 
        details: error.message 
      });
    }
  }

  // Finalizar ou cancelar reserva
  public async finalizarReserva(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'finalizada' ou 'cancelada'

      if (!['finalizada', 'cancelada'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido. Use "finalizada" ou "cancelada"' });
      }

      const reserva = await Reserva.findById(id);
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }

      if (reserva.status !== 'ativa') {
        return res.status(400).json({ error: 'Reserva já está finalizada ou cancelada' });
      }

      // Atualizar reserva
      const reservaAtualizada = await Reserva.findByIdAndUpdate(
        id,
        {
          status,
          data_devolucao: new Date(),
        },
        { new: true }
      ).populate('usuario veiculo');

      // Liberar veículo
      await Veiculo.findByIdAndUpdate(reserva.veiculo, { disponivel: true });

      // Remover reserva ativa do usuário
      await User.findByIdAndUpdate(reserva.usuario, { reserva: null });

      return res.json(reservaAtualizada);
    } catch (error: any) {
      return res.status(500).json({ 
        error: 'Erro ao finalizar reserva', 
        details: error.message 
      });
    }
  }

  // Listar reservas por usuário (histórico)
  public async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Verificar se usuário existe
      const usuario = await User.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Buscar reservas do usuário
      const reservas = await Reserva.find({ usuario: id })
        .populate('veiculo')
        .sort({ data_reserva: -1 });

      return res.json({
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          username: usuario.username,
        },
        reserva_ativa: usuario.reserva,
        historico_reserva: reservas,
        total_reservas: reservas.length,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar reservas do usuário' });
    }
  }

  // Listar todas as reservas (admin)
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const reservas = await Reserva.find()
        .populate('usuario', '-senha')
        .populate('veiculo')
        .sort({ createdAt: -1 });

      return res.json(reservas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
  }
}

export default new ReservaController();