import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuariosService
{
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

  async listarTodos()
  {
    return this.usuarioModel.find();
  }

  async crearUsuario(datos: any)
  {
    const nuevo = new this.usuarioModel({
      nombre: datos.nombre,
      correo: datos.correo,
      clave: datos.clave,
      tipo: datos.tipo || 'usuario',
      activo: true,
    });
    return nuevo.save();
  }

  async deshabilitarUsuario(id: string)
  {
    return this.usuarioModel.findByIdAndUpdate(id, { activo: false });
  }

  async habilitarUsuario(id: string)
  {
    return this.usuarioModel.findByIdAndUpdate(id, { activo: true });
  }
}
