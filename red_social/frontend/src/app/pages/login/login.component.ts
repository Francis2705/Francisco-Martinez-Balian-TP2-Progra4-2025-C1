import { Component, OnInit, signal, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

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
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20),
        Validators.pattern('.*[A-Z].*'), Validators.pattern('.*\\d.*')]})
    });
  }

  async login()
  {
    if (!this.formulario?.valid)
    {
      return this.mensajeLogin.set('Error, formulario inválido');
    }

    try
    {
      const response = await fetch('http://localhost:3000/autenticacion/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({correo: this.formulario.value.correo, clave: this.formulario.value.clave})
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data);
      if (data.ok)
      {
        console.log('login exitoso', data);
        this.mensajeLogin.set('Sesión iniciada correctamente.');
        this.cdr.detectChanges();
        this.router.navigate(['/publicaciones']);
      }
      else
      {
        if (data.ok === false && data.error === 'mail inexistente')
        {
          this.mensajeLogin.set('Error, mail no registrado.');
          console.log('mail no registrado', data.ok);
          this.cdr.detectChanges();
        }
        else if(data.ok === false && data.error === 'clave incorrecta')
        {
          this.mensajeLogin.set('Error, clave incorrecta.');
          console.log('clave incorrecta', data.ok);
          this.cdr.detectChanges();
        }
      }
    }
    catch (error)
    {
      console.log('error en el backend', error);
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