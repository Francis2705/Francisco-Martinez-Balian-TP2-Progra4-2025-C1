import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { schema } from './entities/autenticacion.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Autenticacion', schema: schema}]),
    JwtModule.register({secret: 'clave_secreta', signOptions: { expiresIn: '60s' },})
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy],
})
export class AutenticacionModule {}