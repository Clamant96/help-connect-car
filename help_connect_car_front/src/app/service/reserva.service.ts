import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reserva } from '../models/Reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private url: string = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  findByAll() {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/reserva`, {headers: headers})
  }

  findById(id: number) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/reserva/${id}`, {headers: headers})
  }

  findByIdUsuario(idUsuario: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/reserva/usuario/${idUsuario}`, {headers: headers})
  }

  postReserva(usuarioId: string, veiculoId: string) {
    const reserva = {
      usuarioId: usuarioId,
      veiculoId: veiculoId
    };
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.post<Reserva>(`${this.url}/reserva`, reserva, {headers: headers})
  }

  postReservaStatus(id: number, status: 'ativa' | 'finalizada' | 'cancelada') {
    const reserva = {
      status: status
    };
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.post<Reserva>(`${this.url}/reserva/${id}/finalizar`, reserva, {headers: headers})
  }

  deleteReserva(id: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.delete<Reserva>(`${this.url}/reserva/${id}`, {headers: headers})
  }
}
