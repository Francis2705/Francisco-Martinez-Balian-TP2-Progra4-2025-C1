import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { Publicacione } from './entities/publicacione.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class PublicacionesService
{
  constructor(@InjectModel(Publicacione.name) private publicacionModel: Model<Publicacione>) {}

  async crearPublicacion(dto: CreatePublicacioneDto, usuarioId: string, imagen?: string)
  {
    const publicacionCreada = await this.publicacionModel.create({...dto, usuario: usuarioId, imagen});
    let data : any = null;

    if(publicacionCreada)
    {
      data = {
        ok: true,
        error: 'no hubo error',
        publicacion: publicacionCreada
      }
    }
    else
    {
      data = {
        ok: false,
        error: 'hubo error',
      }
    }
    return data;
  } //listo

  async darMeGusta(id: string, usuarioId: string)
  {
    return this.publicacionModel.findByIdAndUpdate(
      id,
      { $addToSet: { meGustas: usuarioId } },
      { new: true },
    );
  } //listo

  async quitarMeGusta(id: string, usuarioId: string)
  {
    return this.publicacionModel.findByIdAndUpdate(
      id,
      { $pull: { meGustas: usuarioId } },
      { new: true },
    );
  } //listo

  async listar(orden: string, offset: number, limit: number, correoUsuario: string)
  {
    if (correoUsuario === 'Todos los usuarios')
    {
      correoUsuario = '';
    }

    let match: any = null;

    if (correoUsuario !== '')
    {
      match = {
        activo: true,
        correoUsuario: correoUsuario
      };
    }
    else
    {
      match = {
        activo: true
      };
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $addFields: {
          cantidadMeGustas: { $size: '$meGustas' }
        }
      },
    ];

    if (orden === 'likes')
    {
      pipeline.push({ $sort: { cantidadMeGustas: -1 } });
    }
    else
    {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push({ $skip: Number(offset) });
    pipeline.push({ $limit: Number(limit) });

    return this.publicacionModel.aggregate(pipeline);
  } //listo

  async obtenerComentarios(publicacionId: string, offset: number, limit: number)
  {
    const publicacion = await this.publicacionModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(publicacionId) } },
      {
        $project: {
          comentarios: {
            $slice: ['$comentarios', offset, limit]
          }
        }
      }
    ]);
    
    return publicacion[0]?.comentarios || [];
  }
}
