import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: "login", loadComponent: () => import('./pages/login/login.component')
        .then((modulo) => modulo.LoginComponent)},
    {path: "registro", loadComponent: () => import('./pages/registro/registro.component')
        .then((modulo) => modulo.RegistroComponent)},
    {path: "publicaciones", loadComponent: () => import('./pages/publicaciones/publicaciones.component')
        .then((modulo) => modulo.PublicacionesComponent)},
    {path: "mi-perfil", loadComponent: () => import('./pages/mi-perfil/mi-perfil.component')
        .then((modulo) => modulo.MiPerfilComponent)},
    {path: "bienvenida", loadComponent: () => import('./pages/bienvenida/bienvenida.component')
        .then((modulo) => modulo.BienvenidaComponent)},
    {path: "", redirectTo: "bienvenida", pathMatch: "full"}
];