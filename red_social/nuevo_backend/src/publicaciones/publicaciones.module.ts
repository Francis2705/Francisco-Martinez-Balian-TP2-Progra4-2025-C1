import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Publicacione, PublicacionSchema } from './entities/publicacione.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacione.name, schema: PublicacionSchema }]),
    MulterModule.register({ dest: './uploads/publicaciones' }),
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
