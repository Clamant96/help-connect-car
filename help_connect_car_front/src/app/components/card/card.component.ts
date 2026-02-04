import { Component, Input } from '@angular/core';
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
}
