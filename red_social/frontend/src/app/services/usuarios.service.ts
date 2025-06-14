import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../clases/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService
{
  private baseUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders()
  {
    const token = localStorage.getItem('token');
    return {headers: new HttpHeaders({Authorization: `Bearer ${token}`})};
  } //listo

  listarUsuarios()
  {
    return this.http.get<Usuario[]>(this.baseUrl, this.getHeaders());
  } //listo

  crearUsuario(datos: any)
  {
    return this.http.post(this.baseUrl, datos, this.getHeaders());
  }

  deshabilitar(id: string)
  {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeaders());
  } //listo

  habilitar(id: string)
  {
    return this.http.post(`${this.baseUrl}/${id}/habilitar`, {}, this.getHeaders());
  } //listo
}
