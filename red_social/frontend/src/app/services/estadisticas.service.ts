import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService
{
  private baseUrl = 'http://localhost:3000/estadisticas';

  constructor(private http: HttpClient) {}

  getPublicacionesPorUsuario(desde: string, hasta: string)
  {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.baseUrl}/publicaciones-por-usuario`, { params });
  }






  getComentariosTotales(desde: string, hasta: string) {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any>(`${this.baseUrl}/comentarios-totales`, { params });
  }

  getComentariosPorPublicacion(desde: string, hasta: string) {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.baseUrl}/comentarios-por-publicacion`, { params });
  }
}
