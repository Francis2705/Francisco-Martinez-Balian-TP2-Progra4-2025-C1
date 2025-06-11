import {
  Controller, Get, Post, Body, Param, Delete, Query, UploadedFile, UseInterceptors, Req, UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { Request } from 'express';

@Controller('publicaciones')
export class PublicacionesController
{
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/publicaciones',
      filename: (req, file, cb) => {
        const name = Date.now() + extname(file.originalname);
        cb(null, name);
      },
    }),
  }))
  async crear(
    @Body('titulo') titulo: string,
    @Body('descripcion') descripcion: string,
    @Body('usuarioId') usuarioId: string,
    @Body('nombreUsuario') nombreUsuario: string,
    @Body('correoUsuario') correoUsuario: string,
    @UploadedFile() file: Express.Multer.File
  )
  {
    const imagen = file?.filename;
    return this.publicacionesService.crearPublicacion({ titulo, descripcion, nombreUsuario, correoUsuario }, usuarioId, imagen);
  } //listo

  @Post(':id/like')
  async like(@Param('id') id: string, @Body() body: { idUsuario: string })
  {
    return this.publicacionesService.darMeGusta(id, body.idUsuario);
  } //listo

  @Delete(':id/unlike')
  async unlike(@Param('id') id: string, @Body('idUsuario') idUsuario: string)
  {
    return this.publicacionesService.quitarMeGusta(id, idUsuario);
  } //listo

  @Get()
  async listar(@Query('orden') orden: string, @Query('offset') offset: number,
    @Query('limit') limit: number, @Query('correoUsuario') correoUsuario: string)
  {
    return this.publicacionesService.listar(orden, offset, limit, correoUsuario);
  } //listo

  @Get(':id/comentarios')
  async obtenerComentarios(
    @Param('id') publicacionId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number
  )
  {
    return this.publicacionesService.obtenerComentarios(publicacionId, offset, limit);
  }
}
