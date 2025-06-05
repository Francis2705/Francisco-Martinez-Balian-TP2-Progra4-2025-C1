import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schema } from './entities/autenticacion.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Autenticacion', schema: schema}])],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}