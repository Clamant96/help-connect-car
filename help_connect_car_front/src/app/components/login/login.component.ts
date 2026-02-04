import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { User } from '../../models/User';
import { AuthService } from './../../service/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public user: User = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
  ){}

  login() {
    this.authService.login(this.user).subscribe((resp: any) => {
      console.log('Login successful:', resp);
      environment.token = `${resp?.auth?.tokenType} ${resp?.auth?.accessToken}`;
      environment.nome = resp?.user?.nome || '';
      environment.id = resp?.user?._id || '';

      this.router.navigate(['/home']);

    }, err => {
      console.log(`Login failed: ${err}`);
    });
  }
}
