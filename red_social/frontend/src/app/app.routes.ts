import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "login", loadComponent: () => import('./pages/login/login.component')
        .then((modulo) => modulo.LoginComponent), canActivate: [NoAuthGuard]},
    {path: "registro", loadComponent: () => import('./pages/registro/registro.component')
        .then((modulo) => modulo.RegistroComponent), canActivate: [NoAuthGuard]},
    {path: "publicaciones", loadComponent: () => import('./pages/publicaciones/publicaciones.component')
        .then((modulo) => modulo.PublicacionesComponent), canActivate: [AuthGuard]},
    {path: "mi-perfil", loadComponent: () => import('./pages/mi-perfil/mi-perfil.component')
        .then((modulo) => modulo.MiPerfilComponent), canActivate: [AuthGuard]},
    {path: "form-publicacion", loadComponent: () => import('./pages/form-publicacion/form-publicacion.component')
        .then((modulo) => modulo.FormPublicacionComponent), canActivate: [AuthGuard]},
    {path: "dashboard-usuarios", loadComponent: () => import('./pages/dashboard-usuarios/dashboard-usuarios.component')
        .then((modulo) => modulo.DashboardUsuariosComponent), canActivate: [AuthGuard]},
    {path: "", redirectTo: "login", pathMatch: "full"}
];