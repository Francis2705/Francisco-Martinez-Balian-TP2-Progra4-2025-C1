import { Component, inject } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Publicacion } from '../publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PublicacionComponent } from '../publicacion/publicacion.component';

@Component({
  selector: 'app-publicaciones',
  imports: [RouterLink, FormsModule, NgFor, PublicacionComponent, AsyncPipe, NgIf],
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

  publicacionSeleccionada: any = null;

  ngOnInit(): void
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.cargarPublicaciones();
    this.publicacionesService.refrescarListado$.subscribe(() => {
      this.cargarPublicaciones(); //se vuelve a llamar cuando llega la señal
    });
    this.authService.verificarSesionActiva();
  } //listo

  abrirModal(pub: Publicacion)
  {
    this.publicacionSeleccionada = pub;
  } //listo

  cerrarModal()
  {
    this.publicacionSeleccionada = null;
  } //listo

  mostrar()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    console.log(this.authService.usuarioLogueado);
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