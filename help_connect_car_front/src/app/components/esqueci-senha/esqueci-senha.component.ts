import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface AtualizarSenha {
  username: string,
  senha: string,
  confirmarSenha: string
}

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.css'
})
export class EsqueciSenhaComponent {

  public user: AtualizarSenha = {
    username: "",
    senha: "",
    confirmarSenha: ""
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  atualizarSenha() {
    this.authService.esqueciSenha(this.user).subscribe((resp: any) => {
      console.log('Update successful:', resp);

      this.router.navigate(['/login']);

    }, (err: any) => {
      console.log('err: ', err);
    });
  }
}
