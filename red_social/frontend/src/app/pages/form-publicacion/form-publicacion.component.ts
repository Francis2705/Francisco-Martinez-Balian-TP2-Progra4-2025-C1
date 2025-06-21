import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { API_URL } from '../direccion';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-publicacion',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
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
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: [null, Validators.required]
    });
  } //listo

  onFileChange(event: any)
  {
    const file = event.target.files[0];

    if (file)
    {
      this.imagenSeleccionada = file;
      this.formulario.get('imagen')?.setValue(file);
      this.formulario.get('imagen')?.setErrors(null);
    }
    else
    {
      this.imagenSeleccionada = null;
      this.formulario.get('imagen')?.setErrors({ required: true });
    }
  } //listo

  async enviar()
  {
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); return; }

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
      const response = await fetch(`${API_URL}publicaciones`, {
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
  } //listo
}