import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../clases/Usuario';

@Component({
  selector: 'app-dashboard-usuarios',
  imports: [RouterLink, NgIf, NgFor, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrl: './dashboard-usuarios.component.css'
})
export class DashboardUsuariosComponent
{
  authService = inject(AuthService);
  usuariosService = inject(UsuariosService);
  usuarios: any[] = [];
  nuevoUsuario = { nombre: '', correo: '', clave: '', tipo: 'usuario' };


  usuario?: Usuario;
  formulario?: FormGroup;
  registro = signal<any | null>(null);
  registro_usuario : any = null;
  mensajeLogin = signal<any | null>(null);
  mostrarClave: boolean = false;
  errorBackend: string = '';
  cdr = inject(ChangeDetectorRef);
  nombreImagen: string = '';
  mensajeError: boolean = false;
  router = inject(Router);

  ngOnInit()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.authService.verificarSesionActiva();
    this.cargarUsuarios();

    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      nombre: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required]}),
      apellido: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(25), Validators.required]}),
      nombre_usuario: new FormControl('', {validators: [Validators.minLength(5), Validators.maxLength(20), Validators.required]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20),
        Validators.pattern('.*[A-Z].*'), Validators.pattern('.*\\d.*')
      ]}),
      repetir_clave: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      imagen: new FormControl(null, Validators.required),
      tipo: new FormControl('', [Validators.required])
    });

    this.formulario.get('repetir_clave')?.valueChanges.subscribe(() => {
      const clave = this.formulario?.get('clave')?.value;
      const repetir = this.formulario?.get('repetir_clave')?.value;

      if (clave !== repetir)
      {
        this.formulario?.get('repetir_clave')?.setErrors({ noCoincide: true });
      }
      else
      {
        if (this.formulario?.get('repetir_clave')?.hasError('noCoincide'))
        {
          this.formulario?.get('repetir_clave')?.setErrors(null);
        }
      }
    });
  }

  cargarUsuarios()
  {
    this.usuariosService.listarUsuarios().subscribe(data => this.usuarios = data);
  } //listo

  // registrarUsuario()
  // {
  //   this.usuariosService.crearUsuario(this.nuevoUsuario).subscribe(() => {
  //     this.nuevoUsuario = { nombre: '', correo: '', clave: '', tipo: 'usuario' };
  //     this.cargarUsuarios();
  //   });
  // }

  deshabilitarUsuario(id: string)
  {
    this.usuariosService.deshabilitar(id).subscribe(() => this.cargarUsuarios());
  } //listo

  habilitarUsuario(id: string)
  {
    this.usuariosService.habilitar(id).subscribe(() => this.cargarUsuarios());
  } //listo



  async guardarDatos()
  {
    if (!this.formulario?.valid && this.mensajeError === false)
    {
      return this.registro.set('Error, formulario inválido');
    }
    else
    {
      const formData = new FormData();
      formData.append('nombre', this.nombre?.value);
      formData.append('apellido', this.apellido?.value);
      formData.append('correo', this.correo?.value);
      formData.append('nombre_usuario', this.nombre_usuario?.value);
      formData.append('clave', this.clave?.value);
      formData.append('fecha_nacimiento', this.fecha_nacimiento?.value);
      formData.append('descripcion', this.descripcion?.value);
      formData.append('imagen', this.imagen?.value);
      formData.append('tipo', this.tipo?.value);

      try
      {
        const response = await fetch('http://localhost:3000/autenticacion/registro', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('Respuesta del backend:', data);
        if (data.ok)
        {
          console.log('registro exitoso', data);
          this.registro.set('registro exitoso');
          this.registro_usuario = data.data;
          this.nombreImagen = `http://localhost:3000/uploads/${data.data.imagen}`;

          // const dataLogin = await this.authService.login(this.correo?.value, this.clave?.value);
          // this.router.navigate(['/publicaciones']);
        }
        else
        {
          if (data.ok === false && data.error === 'correo existente')
          {
            this.registro.set('mail repetido');
            this.errorBackend = 'Error, el correo ya esta registrado.';
            console.log('mail repetido', data.ok);
            this.cdr.detectChanges();
          }
          else if(data.ok === false && (data.error === '1920' || data.error === '2024'))
          {
            this.registro.set('Error, año de nacimiento inválido');
            this.errorBackend = 'El año de nacimiento debe estar entre 1920 y 2024.';
            console.log('año de nacimiento inválido', data.ok);
            this.cdr.detectChanges();
          }
        }
      }
      catch (error)
      {
        this.errorBackend = 'Error al conectar con el servidor.';
      }
    }
  }

  seleccionarImagen(event: any)
  {
    const file = event.target.files[0];
    if (file && !(file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.png')))
    {
      this.mensajeError = true;
      return;
    }
    if (file)
    {
      this.formulario?.get('imagen')?.setValue(file);
      this.mensajeError = false;
    }
  }

  verClave()
  {
    this.mostrarClave = !this.mostrarClave;
  }

  get correo() {return this.formulario?.get('correo');}
  get nombre() {return this.formulario?.get('nombre');}
  get apellido() {return this.formulario?.get('apellido');}
  get nombre_usuario() {return this.formulario?.get('nombre_usuario');}
  get clave() {return this.formulario?.get('clave');}
  get repetir_clave() { return this.formulario?.get('repetir_clave'); }
  get fecha_nacimiento() { return this.formulario?.get('fecha_nacimiento'); }
  get descripcion() { return this.formulario?.get('descripcion'); }
  get imagen() { return this.formulario?.get('imagen'); }
  get tipo() { return this.formulario?.get('tipo'); }
}