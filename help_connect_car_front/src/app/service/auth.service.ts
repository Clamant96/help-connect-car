import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = environment.url;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  register(user: User) {
    return this.http.post<User>(`${this.url}/auth/register`, user)
  }

  login(user: User) {
    return this.http.post<any>(`${this.url}/auth/login`, user)
  }

  logout(): void {
    environment.id = '';
    environment.nome = '';
    environment.token = '';
    this.router.navigate(['/login']);
  }

}
