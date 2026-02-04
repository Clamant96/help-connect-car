import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  public user: User = new User();

    constructor(
      private authService: AuthService,
      private router: Router,
    ){}

    register() {
      this.authService.register(this.user).subscribe((resp: any) => {
        console.log('Register successful:', resp);

        this.router.navigate(['/login']);

      }, err => {
        console.log(`Registro failed:`, err);
        alert('O nome de usuário já está cadastrado.');
      });
    }

}
