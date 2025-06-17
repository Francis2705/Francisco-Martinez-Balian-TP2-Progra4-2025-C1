import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AuthGuard } from '@nestjs/passport';
import { TiposGuard } from 'src/usuarios/tipos.guard';
import { Tipos } from 'src/usuarios/tipos.decorator';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  // @UseGuards(AuthGuard('jwt'), TiposGuard)
  // @Tipos('administrador')
  async publicacionesPorUsuario(@Query('desde') desde: string, @Query('hasta') hasta: string)
  {
    const desdeFecha = new Date(desde);
    const hastaFecha = new Date(hasta);
    return this.estadisticasService.publicacionesPorUsuario(desdeFecha, hastaFecha);
  }

  @Get('comentarios-totales')
  // @UseGuards(AuthGuard('jwt'), TiposGuard)
  // @Tipos('administrador')
  async comentariosTotales(@Query('desde') desde: string, @Query('hasta') hasta: string)
  {
    return this.estadisticasService.cantidadComentariosTotales(new Date(desde), new Date(hasta));
  }

  @Get('comentarios-por-publicacion')
  // @UseGuards(AuthGuard('jwt'), TiposGuard)
  // @Tipos('administrador')
  async comentariosPorPublicacion(@Query('desde') desde: string, @Query('hasta') hasta: string)
  {
    return this.estadisticasService.comentariosPorPublicacion(new Date(desde), new Date(hasta));
  }
}