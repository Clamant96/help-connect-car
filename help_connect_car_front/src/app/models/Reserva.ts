import { User } from "./User";
import { Veiculo } from "./Veiculo";

export class Reserva {
  usuario: User;
  veiculo: Veiculo;
  status: 'ativa' | 'finalizada' | 'cancelada';
  data_reserva: Date;
  data_devolucao?: Date;
  createdAt: Date;
  updatedAt: Date;
}
