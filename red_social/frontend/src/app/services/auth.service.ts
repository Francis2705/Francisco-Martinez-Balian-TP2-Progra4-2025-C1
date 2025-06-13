import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService
{
  usuarioLogueado: any = null;
  usuariosTotales: any[] = [];

  constructor(private router: Router) {}

  async login(correo: string, clave: string): Promise<any>
  {
    try
    {
      const response = await fetch('http://localhost:3000/autenticacion/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave })
      });

      const data = await response.json();

      if (data.ok)
      {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const expTimestamp = payload.exp * 1000;

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data));
        localStorage.setItem('expiracion', expTimestamp.toString());
        this.usuarioLogueado = data.data;

        const tiempoRestante = expTimestamp - Date.now();
        this.autoLogout(tiempoRestante / 1000);
      }

      return data;
    }
    catch (error)
    {
      return { ok: false, error: 'fallo conexion' };
    }
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('expiracion');
    this.usuarioLogueado = null;
    this.router.navigate(['/login']);
  }

  // isAuthenticated(): boolean
  // {
  //   return !!localStorage.getItem('token');
  // }
  isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const expiracion = Number(localStorage.getItem('expiracion'));

  if (!token || !expiracion) return false;
  return Date.now() < expiracion;
}

  autoLogout(segundos: number): void {
    setTimeout(() => {
      this.logout();
      alert('Tu sesión ha expirado por inactividad.');
    }, segundos * 1000);
  }

  // getUsuario()
  // {
  //   return JSON.parse(localStorage.getItem('usuario') || '{}');
  // }
  getUsuario(): any {
    if (!this.usuarioLogueado) {
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        this.usuarioLogueado = JSON.parse(usuarioString);
      }
    }
    return this.usuarioLogueado;
  }

  verificarSesionActiva(): void {
    const expiracion = Number(localStorage.getItem('expiracion'));
    if (this.isAuthenticated()) {
      const tiempoRestante = expiracion - Date.now();
      this.autoLogout(tiempoRestante / 1000);
      this.getUsuario(); // Recupera usuario si es necesario
    } else {
      this.logout();
    }
  }

  async getUsuariosTotales(): Promise<any>
  {
    const response = await fetch('http://localhost:3000/autenticacion/usuarios');
    const data = await response.json();
    return data.listaUsuarios;
  }
}
