import { Controller, Get, Post, Body, Param, Delete, Query, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicacionesService } from './publicaciones.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';

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
  async obtenerComentarios(@Param('id') publicacionId: string, @Query('offset') offset: number, @Query('limit') limit: number)
  {
    return this.publicacionesService.obtenerComentarios(publicacionId, offset, limit);
  } //listo

  @Post(':id/comentarios')
  async comentar(@Param('id') publicacionId: string, @Body() comentarioDto: CreateComentarioDto)
  {
    return this.publicacionesService.agregarComentario(publicacionId, comentarioDto);
  } //listo

  @Delete(':id')
  async eliminar(@Param('id') publicacionId: string)
  {
    return this.publicacionesService.eliminar(publicacionId);
  } //listo

  @Put(':id')
  async actualizarPublicacion(@Param('id') id: string, @Body() body: any)
  {
    return this.publicacionesService.actualizar(id, body);
  } //listo
}