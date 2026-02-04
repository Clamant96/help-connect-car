import { ReservaService } from './../../service/reserva.service';
import { VeiculoService } from './../../service/veiculo.service';
import { environment } from './../../../environments/environment';
import { Component } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { FooterComponent } from "../util/footer/footer.component";
import { AuthService } from '../../service/auth.service';
import { Veiculo } from '../../models/Veiculo';
import { FiltroComponent } from "../util/filtro/filtro.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, FooterComponent, FiltroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public id: string = environment.id;
  public nome: string = environment.nome;
  public veiculos: Veiculo[] = [];
  public historico: Veiculo[] = [];
  public filtro: boolean = true;

  constructor(
    private authService: AuthService,
    private veiculoService: VeiculoService,
    private reservaService: ReservaService
  ) {
    if (!environment.token) {
      this.authService.logout();
    }
  }

  ngOnInit() {
    this.getAllVeiculos();
    this.getAllHistoricoVeiculosByIdUsuario(environment.id);
  }

  getAllVeiculos() {
    this.veiculoService.findByAll().subscribe((resp: any) => {
      console.log('Veículos encontrados:', resp);
      this.veiculos = resp;
    });
  }

  getAllVeiculosByNome(event: any) {
    const nome = event.target.value;
    if(nome == '' || nome == null || nome == undefined) {
      this.getAllVeiculos();
    }
    this.veiculoService.findByNome(nome).subscribe((resp: any) => {
      console.log('Veículos encontrados:', resp);
      this.veiculos = resp;
    });
  }

  getAllHistoricoVeiculosByIdUsuario(id: string) {
    this.reservaService.findByIdUsuario(id).subscribe((resp: any) => {
      console.log('Histórico de veículos encontrados:', resp);
      resp?.historico_reserva.map((item: any) => {
        item.veiculo.status = item.status
        item.veiculo.reserva = item._id;
      }); // popula o status atual do historico no objeto do veiculo
      this.historico = resp?.historico_reserva.map((item: any) => item.veiculo);
    });
  }

  receberIdVeiculo(event: any) {
    console.log('ID do veículo recebido:', event);
    this.reservaService.postReserva(this.id, event).subscribe((resp: any) => {
      console.log('Reserva realizada:', resp);
      this.getAllVeiculos(); // recarrega a lista de veiculos apos a reserva feita
      this.getAllHistoricoVeiculosByIdUsuario(this.id); // popula o status atual do historico no objeto do veiculo
    });

  }

  receberStatusReserva(event: any) {
    console.log('Status da reserva recebido:', event);
    const obj = {
      id: event.id,
      status: event.status
    }
    this.reservaService.postReservaStatus(
      obj.id,
      obj.status
    ).subscribe((resp: any) => {
      console.log('Reserva atualizada:', resp);
      this.getAllVeiculos(); // recarrega a lista de veiculos apos a reserva feita
      this.getAllHistoricoVeiculosByIdUsuario(environment.id); // recarrega a lista de veiculos apos a reserva atualizada
    });
  }

  receberFiltro(event: any) {
    console.log('Filtro recebido:', event);
    this.veiculoService.postFiltro(event).subscribe((resp: any) => {
      console.log('Filtro aplicado:', resp);
      this.veiculos = resp;
      console.log(`this.veiculos: `, this.veiculos);
    }, err => {
      this.veiculos = [];
    });
  }

  isFiltro() {
    this.filtro = false;
  }

}
