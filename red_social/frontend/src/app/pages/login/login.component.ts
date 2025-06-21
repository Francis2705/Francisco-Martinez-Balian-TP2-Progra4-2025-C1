import { Component, OnInit, signal, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit
{
  formulario?: FormGroup;
  mensajeLogin = signal<any | null>(null);
  mostrarClave: boolean = false;
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  authService = inject(AuthService);
  cargando = false;

  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20),
        Validators.pattern('.*[A-Z].*'), Validators.pattern('.*\\d.*')]})
    });
  } //listo

  async loguearse()
  {
    if (!this.formulario?.valid)
    {
      return this.mensajeLogin.set('Error, formulario inválido');
    }
    else
    {
      this.cargando = true;
      this.cdr.detectChanges();

      const correo = this.formulario.value.correo;
      const clave = this.formulario.value.clave;

      const data = await this.authService.login(correo, clave);

      if (data.ok)
      {
        this.mensajeLogin.set('Sesión iniciada correctamente.');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/publicaciones']);
        }, 1500);
      }
      else
      {
        this.cargando = false;
        if (data.error === 'mail inexistente')
        {
          this.mensajeLogin.set('Error, mail no registrado.');
        }
        else if (data.error === 'clave incorrecta')
        {
          this.mensajeLogin.set('Error, clave incorrecta.');
        }
        else if (data.error === 'usuario baneado')
        {
          this.mensajeLogin.set('Error, usuario baneado.');
        }
        else if (data.error === 'fallo conexion')
        {
          this.mensajeLogin.set('Error al conectar con el servidor.');
        }
        this.cdr.detectChanges();
      }
    }
  } //listo

  loginRapido(usuario: string)
  {
    this.formulario?.setValue({
      correo: usuario + '@gmail.com',
      clave: 'Hola1234'
    });
  } //listo

  verClave()
  {
    this.mostrarClave = !this.mostrarClave;
  } //listo

  get correo() {return this.formulario?.get('correo');}
  get clave() {return this.formulario?.get('clave');}
}