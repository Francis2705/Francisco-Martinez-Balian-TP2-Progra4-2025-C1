import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor()
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //lee el token del header Authorization
            ignoreExpiration: false,
            secretOrKey: 'clave_secreta', //tiene que ser la misma que en jwtService.sign()
        });
    }

    async validate(payload: any)
    {
        return {
            _id: payload.sub,
            apellido: payload.apellido,
            correo: payload.correo,
            descripcion: payload.descripcion,
            fecha_nacimiento: payload.fecha_nacimiento,
            imagen: payload.imagen,
            nombre: payload.nombre,
            nombre_usuario: payload.nombre_usuario,
            tipo: payload.tipo,
        };
    }
}
