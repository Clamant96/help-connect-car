import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Menu {
  inicio: boolean,
  agendamento: boolean,
  central: boolean,
  perfil: boolean
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Output() menuStatus = new EventEmitter<Menu>();

  public menu: Menu = {
    inicio: true,
    agendamento: false,
    central: false,
    perfil: false
  }

  gerenciaMenu(tipo: 'inicio' | 'agendamento' | 'central' | 'perfil', status: boolean) {
    this.menu = {
      inicio: false,
      agendamento: false,
      central: false,
      perfil: false
    } // zera para default
    this.menu[tipo] = status;
    this.menuStatus.emit(this.menu);
  }

}
