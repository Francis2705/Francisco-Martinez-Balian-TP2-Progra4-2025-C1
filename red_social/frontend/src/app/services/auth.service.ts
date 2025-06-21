import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from '../pages/direccion';

@Injectable({
  providedIn: 'root',
})
export class AuthService
{
  private baseUrl = `${API_URL}autenticacion`;

  usuarioLogueado: any = null;
  usuariosTotales: any[] = [];
  nombresUsuarios: any[] = [];

  private timeoutLogout: any;
  private timeoutModal: any;

  constructor(private router: Router) {}

  async login(correo: string, clave: string): Promise<any>
  {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, clave })
    });

    const data = await response.json();

    if (data.ok)
    {
      this.setSession(data.token, data.data);
    }

    return data;
  } //listo

  setSession(token: string, usuario: any): void
  {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expTimestamp = payload.exp * 1000;

    localStorage.setItem('token', token);
    console.log(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('expiracion', expTimestamp.toString());

    this.usuarioLogueado = usuario;

    const tiempoRestante = expTimestamp - Date.now();

    this.autoLogout(tiempoRestante / 1000);
    this.programarRenovacionToken(tiempoRestante / 1000);
  } //listo

  programarRenovacionToken(segundos: number): void
  {
    clearTimeout(this.timeoutModal);
    const tiempoAntes = segundos - 600;
    if (tiempoAntes > 0)
    {
      this.timeoutModal = setTimeout(() => {
        const continuar = confirm('¿Querés seguir conectado?');

        if (continuar)
        {
          this.renovarToken();
        }
        else
        {
          this.logout();
        }
      }, tiempoAntes * 1000);
    }
  } //listo

  async renovarToken(): Promise<void>
  {
    const token = localStorage.getItem('token');
    try
    {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.ok)
      {
        this.setSession(data.token, data.data);
      }
      else
      {
        this.logout();
      }
    }
    catch (error)
    {
      this.logout();
    }
  } //listo

  logout()
  {
    clearTimeout(this.timeoutLogout);
    clearTimeout(this.timeoutModal);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('expiracion');
    this.usuarioLogueado = null;
    this.router.navigate(['/login']);
  } //listo

  isAuthenticated(): boolean
  {
    const token = localStorage.getItem('token');
    const expiracion = Number(localStorage.getItem('expiracion'));

    if (!token || !expiracion) return false;
    return Date.now() < expiracion;
  } //listo

  autoLogout(segundos: number): void
  {
    clearTimeout(this.timeoutLogout);
    this.timeoutLogout = setTimeout(() => {
      this.logout();
      alert('Tu sesión ha expirado por inactividad.');
    }, segundos * 1000);
  } //listo

  getUsuario(): any
  {
    if (!this.usuarioLogueado)
    {
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString)
      {
        this.usuarioLogueado = JSON.parse(usuarioString);
      }
    }
    return this.usuarioLogueado;
  } //listo

  verificarSesionActiva(): void
  {
    const expiracion = Number(localStorage.getItem('expiracion'));
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (this.isAuthenticated())
    {
      const tiempoRestante = expiracion - Date.now();
      this.usuarioLogueado = usuario ? JSON.parse(usuario) : null;
      this.autoLogout(tiempoRestante / 1000);
      this.programarRenovacionToken(tiempoRestante / 1000);
    }
    else
    {
      this.logout();
    }
  } //listo

  async getUsuariosTotales(): Promise<any>
  {
    const response = await fetch(`${this.baseUrl}/usuarios`);
    const data = await response.json();
    return data.listaUsuarios;
  } //listo

  async getNombreUsuarios(): Promise<any>
  {
    const response = await fetch(`${this.baseUrl}/usuarios/nombres`);
    const data = await response.json();
    console.log(data);

    return data.listaNombreUsuarios;
  } //listo
}
