import mongoose, { Schema, Document } from 'mongoose';

export interface IVeiculo extends Document {
  name: string;
  year: string;
  type: string;
  engine: string;
  size: number;
  disponivel: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VeiculoSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome do veículo é obrigatório'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Ano do veículo é obrigatório'],
  },
  type: {
    type: String,
    required: [true, 'Tipo do veículo é obrigatório'],
  },
  engine: {
    type: String,
    required: [true, 'Motor do veículo é obrigatório'],
  },
  size: {
    type: Number,
    required: [true, 'Quantidade de lugares é obrigatória'],
    min: [1, 'Veículo deve ter pelo menos 1 lugar'],
    max: [7, 'Veículo não pode ter mais de 7 lugares'],
  },
  disponivel: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IVeiculo>('Veiculo', VeiculoSchema);