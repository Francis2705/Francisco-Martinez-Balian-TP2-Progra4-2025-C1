import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../pages/publicacion';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService
{
  private baseUrl = 'http://localhost:3000/publicaciones';
  authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  darMeGusta(idPublicacion: string, idUsuario: string)
  {
    return this.http.post<Publicacion>(`${this.baseUrl}/${idPublicacion}/like`, { idUsuario });
  } //listo

  quitarMeGusta(idPublicacion: string, idUsuario: string)
  {
    return this.http.delete<Publicacion>(`${this.baseUrl}/${idPublicacion}/unlike`, { body: {idUsuario} });
  } //listo

  listarPublicaciones(orden: 'fecha' | 'likes', offset: number, limit: number, correoUsuario: string | null)
  {
    console.log(correoUsuario);
    if (correoUsuario !== null)
    {
      return this.http.get<Publicacion[]>(`${this.baseUrl}?orden=${orden}&offset=${offset}&limit=${limit}`);
    }
    else
    {
      return this.http.get<Publicacion[]>(`${this.baseUrl}?orden=${orden}&offset=${offset}&limit=${limit}&correoUsuario=${correoUsuario}`);
    }
  }

}