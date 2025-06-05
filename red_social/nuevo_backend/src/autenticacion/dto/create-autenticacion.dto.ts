import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateAutenticacionDto
{
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido: string;
    @IsEmail({}, { message: 'Correo inválido' })
    correo: string;
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    nombre_usuario: string;
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    clave: string;
    @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
    fecha_nacimiento: Date;
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;
    @IsNotEmpty({ message: 'El tipo es obligatorio' })
    tipo: string;
}