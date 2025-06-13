import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionComponent } from '../publicacion/publicacion.component';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink, DatePipe, NgFor, PublicacionComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent
{
  auth = inject(AuthService);
  publicacionesService = inject(PublicacionesService);
  publicaciones: any = null;

  ngOnInit()
  {
    this.cargarPublicaciones();
  }

  get imagenUrl(): string
  {
    return `http://localhost:3000/uploads/${this.auth.usuarioLogueado.imagen}`;
  }

  cargarPublicaciones()
  {
    this.publicacionesService.listarPublicaciones('fecha', 0, 3, this.auth.usuarioLogueado.correo)
      .subscribe(data => {
        console.log('Publicaciones recibidas:', data);
        this.publicaciones = data;
      });
  }
}