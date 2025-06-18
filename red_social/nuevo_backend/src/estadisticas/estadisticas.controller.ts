import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AuthGuard } from '@nestjs/passport';
import { TiposGuard } from 'src/usuarios/tipos.guard';
import { Tipos } from 'src/usuarios/tipos.decorator';

@Controller('estadisticas')
export class EstadisticasController
{
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  async publicacionesPorUsuario(@Query('desde') desde: string, @Query('hasta') hasta: string)
  {
    const desdeFecha = new Date(desde);
    const hastaFecha = new Date(hasta);
    return this.estadisticasService.publicacionesPorUsuario(desdeFecha, hastaFecha);
  }

  @Get('publicacion')
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  async devolverPublicacion(@Query('_id') _id: string)
  {
    return this.estadisticasService.devolverPublicacion(_id);
  }

  @Get('titulos-ids')
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  async devolverTitulosIds()
  {
    return this.estadisticasService.devolverTitulosYIds();
  }
}