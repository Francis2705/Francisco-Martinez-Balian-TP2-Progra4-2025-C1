export class Usuario
{
    nombre: string;
    apellido: string;
    correo: string;
    nombre_usuario: string;
    clave: string;
    fecha_nacimiento: Date;
    descripcion: string;
    tipo: string;
    imagen?: string;
    id?: number;

    constructor(nombre: string, apellido: string, correo: string, nombre_usuario: string,
        clave: string, fecha_nacimiento: Date, descripcion: string, tipo: string, imagen?: string, id?: number)
    {
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.nombre_usuario = nombre_usuario;
        this.clave = clave;
        this.fecha_nacimiento = fecha_nacimiento;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.imagen = imagen;
        this.id = id;
    }
}