export interface Publicacion
{
    _id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    usuario:
    {
        _id: string;
        nombre: string;
        foto: string;
    };
    meGustas: string[];
    comentarios:
    {
        usuario: { _id: string; nombre: string; };
        texto: string;
    }[];
    createdAt: Date;
    cantidadMeGustas: number;
    nombreUsuario: string;
}