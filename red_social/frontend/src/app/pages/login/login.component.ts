import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit
{
  formulario?: FormGroup;
  mensajeLogin = signal<any | null>(null);
  mostrarClave: boolean = false;

  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20),
        Validators.pattern('.*[A-Z].*'), Validators.pattern('.*\\d.*')]})
    });
  }

  async login() //hacer login
  {
    if (!this.formulario?.valid)
    {
      return this.mensajeLogin.set('Error, formulario inválido');
    }
  }

  loginRapido(usuario: string)
  {
    this.formulario?.setValue({
      correo: usuario + '@gmail.com',
      clave: 'Hola1234'
    });
  }

  verClave()
  {
    this.mostrarClave = !this.mostrarClave;
  }

  get correo() {return this.formulario?.get('correo');}
  get clave() {return this.formulario?.get('clave');}
}