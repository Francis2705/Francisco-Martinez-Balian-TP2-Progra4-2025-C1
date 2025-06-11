import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-form-publicacion',
  imports: [ReactiveFormsModule],
  templateUrl: './form-publicacion.component.html',
  styleUrl: './form-publicacion.component.css'
})
export class FormPublicacionComponent
{
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  formulario: FormGroup;
  imagenSeleccionada: File | null = null;

  constructor()
  {
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: [null]
    });
  }

  onFileChange(event: any)
  {
    this.imagenSeleccionada = event.target.files[0];
  }

  async enviar()
  {
    if (this.formulario.invalid) return;

    const formData = new FormData();
    formData.append('titulo', this.formulario.value.titulo);
    formData.append('descripcion', this.formulario.value.descripcion);
    formData.append('usuarioId', this.authService.getUsuario()._id);
    formData.append('nombreUsuario', this.authService.usuarioLogueado.nombre);
    formData.append('correoUsuario', this.authService.usuarioLogueado.correo);
    if (this.imagenSeleccionada)
    {
      formData.append('imagen', this.imagenSeleccionada);
    }

    try
    {
      const response = await fetch('http://localhost:3000/publicaciones', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.ok)
      {
        console.log(data.publicacion)
        this.router.navigate(['/publicaciones']);
      }
    }
    catch (error)
    {
      console.log('error:', error)
    }
  }
}