import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  findById(id: string) {
    const headers = new HttpHeaders({
      'Authorization': `${environment.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get<User>(`${this.url}/usuario/${id}`, {headers: headers})
  }

}
