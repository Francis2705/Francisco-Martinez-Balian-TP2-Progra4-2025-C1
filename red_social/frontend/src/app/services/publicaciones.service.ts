import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../pages/publicacion';
import { AuthService } from './auth.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService
{
  private baseUrl = 'http://localhost:3000/publicaciones';
  authService = inject(AuthService);

  private _refrescarListado$ = new Subject<void>();
  refrescarListado$ = this._refrescarListado$.asObservable();

  constructor(private http: HttpClient) {}

  emitirRecarga()
  {
    this._refrescarListado$.next();
  }

  darMeGusta(idPublicacion: string, idUsuario: string)
  {
    return this.http.post<Publicacion>(`${this.baseUrl}/${idPublicacion}/like`, { idUsuario });
  } //listo

  quitarMeGusta(idPublicacion: string, idUsuario: string)
  {
    return this.http.delete<Publicacion>(`${this.baseUrl}/${idPublicacion}/unlike`, { body: {idUsuario} });
  } //listo

  listarPublicaciones(orden: 'fecha' | 'likes', offset: number, limit: number, correoUsuario: string)
  {
    return this.http.get<Publicacion[]>(`${this.baseUrl}?orden=${orden}&offset=${offset}&limit=${limit}&correoUsuario=${correoUsuario}`);
  } //listo

  getComentarios(publicacionId: string, offset: number, limit: number): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.baseUrl}/${publicacionId}/comentarios`, {params: { offset, limit }});
  } //listo

  agregarComentario(publicacionId: string, comentario: { texto: string, usuarioId: string, nombreUsuario: string })
  {
    console.log(`${this.baseUrl}/${publicacionId}/comentarios`);
    return this.http.post(`${this.baseUrl}/${publicacionId}/comentarios`, comentario);
  } //listo

  eliminarPublicacion(publicacionId: string)
  {
    return this.http.delete(`${this.baseUrl}/${publicacionId}`);
  } //listo

  actualizarPublicacion(publicacionId: string, datos: { titulo: string; descripcion: string })
  {
    return this.http.put<Publicacion>(`${this.baseUrl}/${publicacionId}`, datos);
  } //listo
}