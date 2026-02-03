import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User';
import { IVeiculo } from './Veiculo';

export interface IReserva extends Document {
  usuario: Types.ObjectId | IUser;
  veiculo: Types.ObjectId | IVeiculo;
  status: 'ativa' | 'finalizada' | 'cancelada';
  data_reserva: Date;
  data_devolucao?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReservaSchema: Schema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório'],
  },
  veiculo: {
    type: Schema.Types.ObjectId,
    ref: 'Veiculo',
    required: [true, 'Veículo é obrigatório'],
  },
  status: {
    type: String,
    enum: ['ativa', 'finalizada', 'cancelada'],
    default: 'ativa',
  },
  data_reserva: {
    type: Date,
    default: Date.now,
  },
  data_devolucao: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Middleware otimizado - EVITA recursão
ReservaSchema.pre('find', function() {
  this.populate({
    path: 'usuario',
    select: 'nome username', // Apenas campos necessários
    // NÃO popula referências dentro do usuário
  }).populate({
    path: 'veiculo',
    select: 'name type year engine size disponivel'
  });
});

ReservaSchema.pre('findOne', function() {
  this.populate({
    path: 'usuario',
    select: 'nome username',
  }).populate({
    path: 'veiculo',
    select: 'name type year engine size disponivel'
  });
});

// Método estático para reservas ativas
ReservaSchema.statics.findAtivasComDetalhes = function() {
  return this.find({ status: 'ativa' })
    .populate({
      path: 'usuario',
      select: 'nome username'
    })
    .populate({
      path: 'veiculo',
      select: 'name type year'
    })
    .sort({ data_reserva: -1 });
};

export default mongoose.model<IReserva>('Reserva', ReservaSchema);