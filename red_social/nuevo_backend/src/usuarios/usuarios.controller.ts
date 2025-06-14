import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { TiposGuard } from './tipos.guard';
import { Tipos } from './tipos.decorator';

@Controller('usuarios')
export class UsuariosController
{
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  listarUsuarios() {
    return this.usuariosService.listarTodos();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  crearUsuario(@Body() datos) {
    return this.usuariosService.crearUsuario(datos);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitarUsuario(id);
  }

  @Post(':id/habilitar')
  @UseGuards(AuthGuard('jwt'), TiposGuard)
  @Tipos('administrador')
  habilitar(@Param('id') id: string) {
    return this.usuariosService.habilitarUsuario(id);
  }
}
