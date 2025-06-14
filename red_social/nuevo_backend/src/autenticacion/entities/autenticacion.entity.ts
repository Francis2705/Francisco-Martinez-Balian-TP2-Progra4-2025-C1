import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";

export type AutenticacionDocument = HydratedDocument<Autenticacion>;
@Schema()
export class Autenticacion
{
    @Prop({required: true})
    nombre: string;
    @Prop({required: true})
    apellido: string;
    @Prop({required: true})
    correo: string;
    @Prop({required: true})
    nombre_usuario: string;
    @Prop({required: true})
    clave: string;
    @Prop({required: true})
    fecha_nacimiento: Date;
    @Prop({required: true})
    descripcion: string;
    @Prop({required: true})
    imagen?: string; // URL de la imagen, se maneja aparte
    @Prop({required: true})
    tipo: string;
    @Prop()
    activo: boolean;
}

export const schema = SchemaFactory.createForClass(Autenticacion);