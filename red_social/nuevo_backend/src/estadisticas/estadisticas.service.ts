import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacione } from 'src/publicaciones/entities/publicacione.entity';

@Injectable()
export class EstadisticasService
{
    constructor(@InjectModel(Publicacione.name) private publicacionModel: Model<Publicacione>) {}

    async publicacionesPorUsuario(desde: Date, hasta: Date)
    {
        const filtro: any = {createdAt: { $gte: desde, $lte: hasta }};
        return this.publicacionModel.find(filtro);
    }

    async cantidadComentariosTotales(desde: Date, hasta: Date)
    {
        return this.publicacionModel.aggregate([
        {
            $match: {createdAt: { $gte: desde, $lte: hasta },},
        },
        {
            $project: {_id: 0,comentarios: 1},
        }
        ]);
    }

    async comentariosPorPublicacion(desde: Date, hasta: Date)
    {
        return this.publicacionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: desde, $lte: hasta },
                },
            },
            {
                $project: {
                    titulo: 1,
                    cantidadComentarios: { $size: '$comentarios' },
                },
            },
        ]);
    }
}