import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Veiculo } from '../models/Veiculo';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  private url: string = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  private autorization = {
    headers: new HttpHeaders().set('Authorization', environment.token)
  }

  findByAll() {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/veiculo`, {headers: headers})
  }

  findById(id: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/veiculo/${id}`, {headers: headers})
  }

  findByNome(nome: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/veiculos/nome/${nome}`, {headers: headers})
  }

  postFiltro(filtro: any) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.post(`${this.url}/veiculos/filtro`, filtro, {headers: headers})
  }

  postVeiculo(veiculo: Veiculo) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.post<Veiculo>(`${this.url}/veiculo`, veiculo, {headers: headers})
  }

  postVeiculos(veiculos: Veiculo[]) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.post<Veiculo[]>(`${this.url}/veiculos`, veiculos, {headers: headers})
  }

  putVeiculo(veiculo: Veiculo) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.put<Veiculo>(`${this.url}/veiculo`, veiculo, {headers: headers})
  }

  deleteVeiculo(id: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.delete(`${this.url}/veiculo/${id}`, {headers: headers})
  }
}
