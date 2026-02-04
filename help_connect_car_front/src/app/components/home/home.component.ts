import { ReservaService } from './../../service/reserva.service';
import { VeiculoService } from './../../service/veiculo.service';
import { environment } from './../../../environments/environment';
import { Component } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../service/auth.service';
import { Veiculo } from '../../models/Veiculo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public nome: string = environment.nome;
  public veiculos: Veiculo[] = [];
  public historico: Veiculo[] = [];

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
      this.historico = resp?.historico_reserva.map((item: any) => item.veiculo);
    });
  }

}
