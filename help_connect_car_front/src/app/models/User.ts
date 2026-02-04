import { Reserva } from "./Reserva";

export class User {
  nome: string;
  username: string;
  senha: string;
  reserva?: Reserva; // Referência à reserva ativa
  historico_reserva: Reserva[]; // Histórico de reservas
  createdAt: Date;
  updatedAt: Date;
}
