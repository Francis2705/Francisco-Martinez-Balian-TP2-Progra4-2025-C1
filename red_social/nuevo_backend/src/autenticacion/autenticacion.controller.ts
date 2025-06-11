import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,
  UploadedFile, BadRequestException, ValidationPipe } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('autenticacion')
export class AutenticacionController
{
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('/registro')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads', //carpeta donde se guarda
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFile() imagen: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateAutenticacionDto)
  {
    if (!imagen)
    {
      throw new BadRequestException('La imagen de perfil es obligatoria');
    }
    try
    {
      return this.autenticacionService.create(body, imagen.filename);
    }
    catch (error)
    {
      console.error(error);
      throw new BadRequestException('Error en el servidor: ' + error.message);
    }
  }

  @Post('login')
  async login(@Body() body: { correo: string, clave: string })
  {
    return this.autenticacionService.login(body.correo, body.clave);
  }

  @Get('usuarios')
  async traerUsuarios()
  {
    return this.autenticacionService.traerUsuarios();
  }
}
