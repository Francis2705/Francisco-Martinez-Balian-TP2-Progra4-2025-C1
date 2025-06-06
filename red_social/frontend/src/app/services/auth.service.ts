import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService
{
  usuarioLogueado: any = null;

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data));
        this.usuarioLogueado = data.data;
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
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean
  {
    return !!localStorage.getItem('token');
  }

  autoLogout(segundos: number)
  {
    setTimeout(() => this.logout(), segundos * 1000);
  }

  getUsuario()
  {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }
}
