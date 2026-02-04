import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Veiculo } from '../../../models/Veiculo';
import { VeiculoService } from '../../../service/veiculo.service';

interface FiltroVeiculo {
  name: string,
  type: string[];
  size: number[];
  engine: string[];
}

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.css'
})
export class FiltroComponent {
  public veiculos: Veiculo[] = [];
  @Output() filtroAplicado = new EventEmitter<FiltroVeiculo>();

  public filtro: FiltroVeiculo = {
    name: "",
    type: [],
    engine: [],
    size: []
  }

  constructor(
    private veiculoService: VeiculoService
  ) {
    this.getAllVeiculos();
  }

  getAllVeiculos() {
    this.veiculoService.findByAll().subscribe((resp: any) => {
      console.log('Veículos encontrados:', resp);
      this.veiculos = resp;
    });
  }

  enviarStatusReserva(filtro: FiltroVeiculo) {
    this.filtroAplicado.emit(filtro);
  }

  formataSize(size: number): string {
    if(size > 0 && size < 10) {
      return `0${size}`;
    }
    return `${size}`;
  }

  filtraValoresUnicos(tipo: 'type' | 'size' | 'engine') {
    if(this.veiculos.length === 0) {
      return [];
    }
    // Função auxiliar para obter valores únicos
    const getUniqueValues = (veiculos: Veiculo[], field: keyof Veiculo): any[] => {
      return [...new Set(veiculos.map(veiculo => veiculo[field]))]
        .filter(value => value != null && value !== '');
    };

    // No seu componente:
    const tiposUnicos = getUniqueValues(this.veiculos, tipo);

    return tiposUnicos;
  }

  filtraValorSelecionado(tipo: 'type' | 'size' | 'engine', valor: any): boolean {
    return this.filtro[tipo].find(value => value === valor) !== undefined;
  }

  selecionar(tipo: 'type' | 'size' | 'engine', valor: any) {
    if (!valor) return;

    if (tipo === 'type' || tipo === 'engine') {
      const valorString = String(valor);
      const index = this.filtro[tipo].indexOf(valorString);

      if (index === -1) {
        // Adiciona se não existir
        this.filtro[tipo].push(valorString);
      } else {
        // Remove se já existir
        this.filtro[tipo].splice(index, 1);
      }
    }
    else if (tipo === 'size') {
      const valorNumber = Number(valor);
      const index = this.filtro[tipo].indexOf(valorNumber);

      if (index === -1) {
        // Adiciona se não existir
        this.filtro[tipo].push(valorNumber);
      } else {
        // Remove se já existir
        this.filtro[tipo].splice(index, 1);
      }
    }

    this.enviarStatusReserva(this.filtro);
  }
}
