import { IsString, IsNotEmpty } from 'class-validator';

export class CreateComentarioDto
{
    @IsString()
    @IsNotEmpty()
    texto: string;
    @IsString()
    @IsNotEmpty()
    usuarioId: string;
    @IsString()
    @IsNotEmpty()
    nombreUsuario: string;
}
