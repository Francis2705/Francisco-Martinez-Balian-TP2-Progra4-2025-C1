import { Inject, Injectable } from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Autenticacion, AutenticacionDocument } from './entities/autenticacion.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AutenticacionService
{
  constructor(@InjectModel(Autenticacion.name) private autenticacionModel: Model<Autenticacion>){}

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
  }

  findAll()
  {
    return `This action returns all autenticacion`;
  }

  findOne(id: number)
  {
    return `This action returns a #${id} autenticacion`;
  }

  update(id: number, updateAutenticacionDto: UpdateAutenticacionDto)
  {
    return `This action updates a #${id} autenticacion`;
  }

  remove(id: number)
  {
    return `This action removes a #${id} autenticacion`;
  }
}
