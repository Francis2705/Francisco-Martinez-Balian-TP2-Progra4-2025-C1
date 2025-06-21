import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../pages/direccion';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService
{
  private baseUrl = `${API_URL}estadisticas`;
  token: string | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders()
  {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  } //listo

  getPublicacionesPorUsuario(desde: string, hasta: string)
  {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/publicaciones-por-usuario`, { params, headers });
  } //listo

  getPublicacion(_id: string)
  {
    const params = new HttpParams().set('_id', _id);
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/publicacion`, { params,headers });
  } //listo

  getTitulosIds()
  {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/titulos-ids`, {headers});
  } //listo
}
