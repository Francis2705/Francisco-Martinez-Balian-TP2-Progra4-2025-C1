import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { Publicacion } from '../publicacion';

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [RouterLink, NgIf, ReactiveFormsModule, FormsModule, NgChartsModule, CommonModule],
  templateUrl: './dashboard-estadisticas.component.html',
  styleUrl: './dashboard-estadisticas.component.css'
})
export class DashboardEstadisticasComponent
{
  authService = inject(AuthService);
  usuarioSeleccionado: string = 'Todos los usuarios';
  usuarioTotales : Promise<any> = this.authService.getUsuariosTotales();
  nombresUsuarios : Promise<any> = this.authService.getNombreUsuarios();
  nombresIdsPublicaciones: any = null;
  publicacionSeleccionadaId: string = '';
  desde = '';
  hasta = '';
  datosPublicaciones: any[] = [];
  datosComentariosPorPublicacion: any[] = [];
  datosComentariosTotales: number | null = null;
  chartDataPublicaciones: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartDataComentarios: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartDataComentariosPorPublicacion: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.authService.verificarSesionActiva();
    this.estadisticasService.getTitulosIds().subscribe(data =>{
      this.nombresIdsPublicaciones = data;
    });
  }

  cargarPublicacionesPorUsuario()
  {
    if (!this.desde || !this.hasta) return;

    // Obtener publicaciones en el rango
    this.estadisticasService.getPublicacionesPorUsuario(this.desde, this.hasta).subscribe(data => {
      this.datosPublicaciones = data;

      // Una vez que se tengan los usuarios también
      this.usuarioTotales.then(usuarios => {
        // Creamos un mapa para contar publicaciones por correo
        const contador: Record<string, number> = {};

        // Inicializamos contador en 0 para cada usuario
        usuarios.forEach((usuario: any) => {
          contador[usuario.correo] = 0;
        });

        // Contamos cuántas publicaciones hizo cada usuario
        data.forEach((publicacion: any) => {
          if (contador.hasOwnProperty(publicacion.correoUsuario)) {
            contador[publicacion.correoUsuario]++;
          }
        });

        // Creamos los datos para el gráfico
        const labels = Object.keys(contador);
        const valores = Object.values(contador);

        this.chartDataPublicaciones = {
          labels,
          datasets: [{
            label: 'Publicaciones por usuario',
            data: valores,
            backgroundColor: '#42A5F5'
          }]
        };
      });
    });
  }

  cargarComentariosPorUsuario()
  {
    if (!this.desde || !this.hasta) return;

  this.estadisticasService.getPublicacionesPorUsuario(this.desde, this.hasta).subscribe(publicaciones => {
    // Inicializamos el contador
    const contadorComentarios: Record<string, number> = {};

    // Recorremos todas las publicaciones
    publicaciones.forEach((publicacion: any) => {
      if (Array.isArray(publicacion.comentarios))
      {
        publicacion.comentarios.forEach((comentario: any) => {
          const nombreUsuario = comentario.usuario?.nombre;
          if (nombreUsuario)
          {
            if (!contadorComentarios[nombreUsuario])
            {
              contadorComentarios[nombreUsuario] = 0;
            }
            contadorComentarios[nombreUsuario]++;
          }
        });
      }
    });

    // Guardamos total general por si lo querés mostrar
    this.datosComentariosTotales = Object.values(contadorComentarios).reduce((a, b) => a + b, 0);

    // Armamos los datos del gráfico
    const labels = Object.keys(contadorComentarios);
    const valores = Object.values(contadorComentarios);

    this.chartDataComentarios = {
      labels,
      datasets: [{
        label: 'Comentarios por usuario',
        data: valores,
        backgroundColor: '#66BB6A'
      }]
    };
  });
  }

  cargarPublicacion() {
  if (!this.publicacionSeleccionadaId || !this.desde || !this.hasta) {
    console.log('Faltan datos');
    return;
  }

  this.estadisticasService.getPublicacion(this.publicacionSeleccionadaId).subscribe((publicacion: any) => {
    if (!publicacion || !Array.isArray(publicacion.comentarios)) return;

    const desdeFecha = new Date(this.desde);
    const hastaFecha = new Date(this.hasta);
    hastaFecha.setHours(23, 59, 59, 999); // incluir todo el día

    // Filtrar comentarios por fecha
    const comentariosFiltrados = publicacion.comentarios.filter((comentario: any) => {
      const fechaComentario = new Date(comentario.createdAt);
      return fechaComentario >= desdeFecha && fechaComentario <= hastaFecha;
    });

    this.datosComentariosPorPublicacion = comentariosFiltrados;

    // Agrupar por fecha
    const contadorPorFecha: Record<string, number> = {};

    comentariosFiltrados.forEach((comentario: any) => {
      const fecha = new Date(comentario.createdAt);
      const fechaFormateada = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
      contadorPorFecha[fechaFormateada] = (contadorPorFecha[fechaFormateada] || 0) + 1;
    });

    // Ordenar las fechas de forma cronológica
    const labels = Object.keys(contadorPorFecha).sort();
    const valores = labels.map(fecha => contadorPorFecha[fecha]);

    // Cargar datos en el gráfico
    this.chartDataComentariosPorPublicacion = {
      labels,
      datasets: [{
        label: 'Cantidad de comentarios por fecha',
        data: valores,
        backgroundColor: '#FF7043'
      }]
    };
  });
}
}