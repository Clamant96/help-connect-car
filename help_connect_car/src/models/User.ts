import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nome: string;
  username: string;
  senha: string;
  reserva?: Types.ObjectId; // Referência à reserva ativa
  historico_reserva: Types.ObjectId[]; // Histórico de reservas
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

const UserSchema: Schema = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
  },
  reserva: {
    type: Schema.Types.ObjectId,
    ref: 'Reserva',
    default: null,
  },
  historico_reserva: [{
    type: Schema.Types.ObjectId,
    ref: 'Reserva',
    default: [],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Método para comparar senha
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.senha);
  } catch (error) {
    console.error('Erro ao comparar senha:', error);
    return false;
  }
};

// Métodos estáticos para queries específicas
UserSchema.statics.findWithReservaAtiva = function(query: any) {
  return this.findOne(query)
    .select('+senha') // Apenas quando precisar da senha
    .populate({
      path: 'reserva',
      populate: {
        path: 'veiculo',
        select: 'name type year' // Apenas campos necessários
      }
    });
};

UserSchema.statics.findWithHistorico = function(query: any, limit = 10) {
  return this.findOne(query)
    .populate({
      path: 'historico_reserva',
      options: { 
        sort: { createdAt: -1 },
        limit: limit
      },
      populate: {
        path: 'veiculo',
        select: 'name type year'
      }
    });
};

export default mongoose.model<IUser>('User', UserSchema);