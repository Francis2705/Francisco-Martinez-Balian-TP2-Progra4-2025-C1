import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard implements CanActivate
{
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean
    {
        if (this.authService.isAuthenticated())
        {
            this.router.navigate(['/publicaciones']);
            console.log(this.authService.usuarioLogueado);
            return false;
        }
        return true;
    }
}
