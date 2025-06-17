import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';

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
  nombresUsuarios : Promise<any> = this.authService.getNombreUsuarios(); //esta es la lista de nombres
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

  ngOnInit()
  {
    this.authService.usuarioLogueado = this.authService.getUsuario();
    this.authService.verificarSesionActiva();
  }

  constructor(private estadisticasService: EstadisticasService) {}

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
      if (Array.isArray(publicacion.comentarios)) {
        publicacion.comentarios.forEach((comentario: any) => {
          const nombreUsuario = comentario.usuario?.nombre;
          if (nombreUsuario) {
            if (!contadorComentarios[nombreUsuario]) {
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




  // cargarEstadisticas() {
  //   this.estadisticasService.getComentariosPorPublicacion(this.desde, this.hasta).subscribe(data => {
  //     this.datosComentariosPorPublicacion = data;
  //     const labels = data.map((item: any) => item.titulo);
  //     const valores = data.map((item: any) => item.total);

  //     this.chartDataComentarios = {
  //       labels,
  //       datasets: [{
  //         label: 'Comentarios por publicación',
  //         data: valores,
  //         backgroundColor: '#66BB6A'
  //       }]
  //     };
  //   });
  // }
}
