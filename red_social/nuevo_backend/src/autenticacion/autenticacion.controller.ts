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

  @Get()
  findAll()
  {
    return this.autenticacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string)
  {
    return this.autenticacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutenticacionDto: UpdateAutenticacionDto)
  {
    return this.autenticacionService.update(+id, updateAutenticacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.autenticacionService.remove(+id);
  }
}
