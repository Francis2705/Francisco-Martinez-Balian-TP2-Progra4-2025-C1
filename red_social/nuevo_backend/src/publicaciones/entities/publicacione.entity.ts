import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Publicacione extends Document
{
    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuario: Types.ObjectId;

    @Prop({ required: true })
    titulo: string;

    @Prop()
    descripcion: string;

    @Prop()
    imagen: string;

    @Prop({ default: true })
    activo: boolean;

    @Prop()
    meGustas: any[];

    @Prop()
    comentarios: any[];

    @Prop()
    nombreUsuario: string;

    @Prop()
    correoUsuario: string;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacione);