import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGO_KEY!), AutenticacionModule, PublicacionesModule, UsuariosModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot('mongodb+srv://franciscomartinezbalian:EXhOcwIAShrglx8W@cluster0.h17xfdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), AutenticacionModule, PublicacionesModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}