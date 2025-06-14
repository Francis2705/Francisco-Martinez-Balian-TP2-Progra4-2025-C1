import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ collection: 'autenticacions' })
export class Usuario
{
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true, unique: true })
    correo: string;

    @Prop({ required: true })
    clave: string;

    @Prop({ default: 'usuario' })
    tipo: string;

    @Prop({ default: true })
    activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);