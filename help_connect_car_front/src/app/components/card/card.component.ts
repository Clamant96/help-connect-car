import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Veiculo } from '../../models/Veiculo';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() veiculo: Veiculo;
  @Output() idVeiculo = new EventEmitter<string>();
  @Output() statusReserva = new EventEmitter<any>();

  enviarIdVeiculo(id: any) {
    this.idVeiculo.emit(id);
  }

  enviarStatusReserva(status: any, id: any) {
    this.statusReserva.emit({status, id});
  }
}
