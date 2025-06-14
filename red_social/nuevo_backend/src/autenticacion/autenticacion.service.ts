import { Inject, Injectable } from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Autenticacion, AutenticacionDocument } from './entities/autenticacion.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AutenticacionService
{
  constructor(@InjectModel(Autenticacion.name) private autenticacionModel: Model<Autenticacion>, private jwtService: JwtService){}

  async create(createAutenticacionDto: CreateAutenticacionDto, imagenNombre: string)
  {
    const { correo } = createAutenticacionDto;

    const usuarioExistente = await this.autenticacionModel.findOne({ correo });
    if (usuarioExistente)
    {
      if (imagenNombre)
      {
        const rutaImagen = path.join(__dirname, '..', '..', 'uploads', imagenNombre);
        if (fs.existsSync(rutaImagen))
        {
          fs.unlinkSync(rutaImagen);
        }
      }
      return { ok: false, error: 'correo existente' };
    }

    const anioNacimiento = new Date(createAutenticacionDto.fecha_nacimiento).getFullYear();
    if (anioNacimiento < 1920)
    {
      if (imagenNombre)
      {
        const rutaImagen = path.join(__dirname, '..', '..', 'uploads', imagenNombre);
        if (fs.existsSync(rutaImagen))
        {
          fs.unlinkSync(rutaImagen);
        }
      }
      return { ok: false, error: '1920' };
    }
    if (anioNacimiento > 2024)
    {
      if (imagenNombre)
      {
        const rutaImagen = path.join(__dirname, '..', '..', 'uploads', imagenNombre);
        if (fs.existsSync(rutaImagen))
        {
          fs.unlinkSync(rutaImagen);
        }
      }
      return { ok: false, error: '2024' };
    }

    const nuevoUsuario = new this.autenticacionModel({...createAutenticacionDto, imagen: imagenNombre,});
    nuevoUsuario.clave = await bcrypt.hash(nuevoUsuario.clave, 10);

    return nuevoUsuario.save()
      .then(data => ({ ok: true, data }))
      .catch(err => ({ ok: false, error: err.message }));
  } //listo

  async traerUsuarios()
  {
    const usuarios = await this.autenticacionModel.find({}, { correo: 1, _id: 0 });
    const data = {
      ok: true,
      listaUsuarios: usuarios
    };

    return data;
  } //listo

  async login(correo: string, clave: string)
  {
    const usuario = await this.autenticacionModel.findOne({ correo });
    if (!usuario) { return { ok: false, error: 'mail inexistente' }; }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) { return { ok: false, error: 'clave incorrecta' }; }

    const activo = usuario.activo;
    if (!activo) { return { ok: false, error: 'usuario baneado'}; }

    const payload = { 
      sub: usuario._id,
      apellido: usuario.apellido,
      correo: usuario.correo,
      descripcion: usuario.descripcion,
      fecha_nacimiento: usuario.fecha_nacimiento,
      imagen: usuario.imagen,
      nombre: usuario.nombre,
      nombre_usuario: usuario.nombre_usuario,
      tipo: usuario.tipo
    };
    const token = this.jwtService.sign(payload, { expiresIn: '60s' });

    return {
      ok: true,
      token,
      data: {
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        nombre_usuario: usuario.nombre_usuario,
        fecha_nacimiento: usuario.fecha_nacimiento,
        descripcion: usuario.descripcion,
        imagen: usuario.imagen,
        tipo: usuario.tipo
      }
    };
  } //listo

  generarToken(usuario: any): string
  {
    const payload = {
      sub: usuario._id,
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nombre_usuario: usuario.nombre_usuario,
      fecha_nacimiento: usuario.fecha_nacimiento,
      descripcion: usuario.descripcion,
      imagen: usuario.imagen,
      tipo: usuario.tipo
    };

    return this.jwtService.sign(payload, { expiresIn: '60s' });
  }
}
