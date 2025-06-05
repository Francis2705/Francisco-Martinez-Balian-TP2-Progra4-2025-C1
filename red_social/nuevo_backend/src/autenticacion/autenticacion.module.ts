import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schema } from './entities/autenticacion.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Autenticacion', schema: schema}]),
    JwtModule.register({secret: 'clave_secreta', signOptions: { expiresIn: '30s' },})
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}