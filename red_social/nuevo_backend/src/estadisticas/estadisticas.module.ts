import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { PublicacionesModule } from 'src/publicaciones/publicaciones.module';
import { JwtStrategy } from 'src/autenticacion/jwt.strategy';

@Module({
  imports: [PublicacionesModule],
  controllers: [EstadisticasController],
  providers: [EstadisticasService, JwtStrategy],
})
export class EstadisticasModule {}
