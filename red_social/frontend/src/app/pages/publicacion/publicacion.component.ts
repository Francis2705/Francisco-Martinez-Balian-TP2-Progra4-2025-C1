import { Component, Input, inject } from '@angular/core';
import { Publicacion } from '../publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css'
})
export class PublicacionComponent
{
  @Input() publicacion!: Publicacion;
  publicacionesService = inject(PublicacionesService);
  authService = inject(AuthService);

  likear()
  {
    this.publicacionesService.darMeGusta(this.publicacion._id, this.authService.usuarioLogueado._id)
      .subscribe(actualizada => {this.publicacion.meGustas = actualizada.meGustas;});
  }

  deslikear()
  {
    this.publicacionesService.quitarMeGusta(this.publicacion._id, this.authService.usuarioLogueado._id)
      .subscribe(actualizada => {this.publicacion.meGustas = actualizada.meGustas;});
  }

  comentar()
  {
    
  }
}
