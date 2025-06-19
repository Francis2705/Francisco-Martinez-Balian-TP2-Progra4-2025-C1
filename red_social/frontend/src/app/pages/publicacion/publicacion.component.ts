import { Component, Input, inject} from '@angular/core';
import { Publicacion } from '../publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  imports: [ReactiveFormsModule, NgIf, NgFor, FormsModule],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css'
})
export class PublicacionComponent
{
  @Input() publicacion!: Publicacion;
  publicacionesService = inject(PublicacionesService);
  authService = inject(AuthService);

  comentarios: any[] = [];
  comentariosOffset = 0;
  comentariosLimit = 3;
  hayMasComentarios = true;

  nuevoComentario = '';
  usuarioId = this.authService.usuarioLogueado._id;
  nombreUsuario = this.authService.usuarioLogueado.nombre;

  editando = false;
  tituloEditado = '';
  descripcionEditada = '';

  ngOnInit()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.usuarioId = this.authService.usuarioLogueado._id;
    this.nombreUsuario = this.authService.usuarioLogueado.nombre;
    this.cargarComentarios();
  } //listo

  likear()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    console.log(this.authService.getUsuario());
    console.log(this.publicacion._id, this.authService.usuarioLogueado._id);
    this.publicacionesService.darMeGusta(this.publicacion._id, this.authService.usuarioLogueado._id)
      .subscribe(actualizada => {this.publicacion.meGustas = actualizada.meGustas;});
  } //listo

  deslikear()
  {
    this.publicacionesService.quitarMeGusta(this.publicacion._id, this.authService.usuarioLogueado._id)
      .subscribe(actualizada => {this.publicacion.meGustas = actualizada.meGustas;});
  } //listo

  comentar()
  {
    if (!this.nuevoComentario.trim()) return;

    this.publicacionesService.agregarComentario(this.publicacion._id, {
      texto: this.nuevoComentario,
      usuarioId: this.usuarioId,
      nombreUsuario: this.nombreUsuario
    }).subscribe(() => {
      this.nuevoComentario = '';
      this.comentarios = [];
      this.comentariosOffset = 0;
      this.hayMasComentarios = true;
      this.cargarComentarios();
    });
  } //listo

  cargarComentarios(): void
  {
    this.publicacionesService.getComentarios(this.publicacion._id, this.comentariosOffset, this.comentariosLimit)
      .subscribe(nuevosComentarios => {
        this.comentarios.push(...nuevosComentarios);
        this.comentariosOffset += this.comentariosLimit;
        if (nuevosComentarios.length < this.comentariosLimit)
        {
          this.hayMasComentarios = false;
        }
      }
    );
  } //listo

  eliminar()
  {
    this.publicacionesService.eliminarPublicacion(this.publicacion._id).subscribe(() => {
      this.publicacionesService.emitirRecarga();
    });
  } //listo

  activarEdicion()
  {
    this.editando = true;
    this.tituloEditado = this.publicacion.titulo;
    this.descripcionEditada = this.publicacion.descripcion;
  } //listo

  guardarCambios()
  {
    this.publicacionesService.actualizarPublicacion(this.publicacion._id, { titulo: this.tituloEditado, descripcion: this.descripcionEditada})
      .subscribe(actualizada => {
        this.publicacion.titulo = actualizada.titulo;
        this.publicacion.descripcion = actualizada.descripcion;
        this.editando = false;
      });
  } //listo

  cancelarEdicion()
  {
    this.editando = false;
  } //listo
}
