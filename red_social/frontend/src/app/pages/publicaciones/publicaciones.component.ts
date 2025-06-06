import { Component, inject } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publicaciones',
  imports: [],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent
{
  authService = inject(AuthService);

  ngOnInit(): void
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.authService.autoLogout(10); //cuando reinicio se me reincia el temporizador
  }

  mostrar()
  {
    console.log(this.authService.usuarioLogueado)
    // this.authService.logout();
  }
}