export class Veiculo {
  _id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: number;
  disponivel: boolean;
  status?: string;
  reserva?: string;
  createdAt: Date;
  updatedAt: Date;
}
