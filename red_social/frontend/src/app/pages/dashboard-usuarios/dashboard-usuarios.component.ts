import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-usuarios',
  imports: [RouterLink, NgIf, NgFor, FormsModule],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrl: './dashboard-usuarios.component.css'
})
export class DashboardUsuariosComponent
{
  authService = inject(AuthService);
  usuariosService = inject(UsuariosService);
  usuarios: any[] = [];
  nuevoUsuario = { nombre: '', correo: '', clave: '', tipo: 'usuario' };

  ngOnInit()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.authService.verificarSesionActiva();
    this.cargarUsuarios();
  } //listo

  cargarUsuarios()
  {
    this.usuariosService.listarUsuarios().subscribe(data => this.usuarios = data);
  } //listo

  registrarUsuario()
  {
    this.usuariosService.crearUsuario(this.nuevoUsuario).subscribe(() => {
      this.nuevoUsuario = { nombre: '', correo: '', clave: '', tipo: 'usuario' };
      this.cargarUsuarios();
    });
  }

  deshabilitarUsuario(id: string)
  {
    this.usuariosService.deshabilitar(id).subscribe(() => this.cargarUsuarios());
  } //listo

  habilitarUsuario(id: string)
  {
    this.usuariosService.habilitar(id).subscribe(() => this.cargarUsuarios());
  } //listo
}