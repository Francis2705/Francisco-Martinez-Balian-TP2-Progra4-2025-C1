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

    async devolverPublicacion(_id: string)
    {
        return this.publicacionModel.findById(_id);
    }

    async devolverTitulosYIds()
    {
        return this.publicacionModel.find({}, { titulo: 1 });
    }
}