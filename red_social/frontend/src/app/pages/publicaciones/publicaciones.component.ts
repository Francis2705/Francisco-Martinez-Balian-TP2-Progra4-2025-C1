import { Component, inject } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Publicacion } from '../publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PublicacionComponent } from '../publicacion/publicacion.component';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@Component({
  selector: 'app-publicaciones',
  imports: [RouterLink, FormsModule, NgFor, PublicacionComponent, AsyncPipe],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent
{
  authService = inject(AuthService);
  usuarioTotales : Promise<any> = this.authService.getUsuariosTotales();
  publicacionesService = inject(PublicacionesService);
  publicaciones: Publicacion[] = [];
  orden: 'fecha' | 'likes' = 'fecha';
  offset = 0;
  limit = 5;
  usuarioSeleccionado: string = 'Todos los usuarios';

  ngOnInit(): void
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.cargarPublicaciones();
    // this.authService.autoLogout(120); //cuando reinicio se me reincia el temporizador
  } //listo

  mostrar()
  {
    console.log(this.authService.usuarioLogueado)
  } //listo

  cerrarSesion()
  {
    this.authService.logout();
  } //listo

  cambiarOrden(orden: 'fecha' | 'likes')
  {
    this.orden = orden;
    this.cargarPublicaciones();
  } //listo

  siguientePagina()
  {
    this.offset += this.limit;
    this.cargarPublicaciones();
  } //listo

  paginaAnterior()
  {
    this.offset = Math.max(this.offset - this.limit, 0);
    this.cargarPublicaciones();
  } //listo

  cambiarUsuario(correoUsuario: string)
  {
    this.offset = 0;
    this.usuarioSeleccionado = correoUsuario;
    this.cargarPublicaciones();
  } //listo

  cargarPublicaciones()
  {
    this.publicacionesService.listarPublicaciones(this.orden, this.offset, this.limit, this.usuarioSeleccionado)
      .subscribe(data => {
        console.log('Publicaciones recibidas:', data);
        this.publicaciones = data;
      });
  } //listo
}