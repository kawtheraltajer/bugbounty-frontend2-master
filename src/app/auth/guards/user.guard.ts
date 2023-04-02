import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private rt: Router,
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { url } = state;
        const user = this.authService.userValue;
        if (user && this.authService.getAccessToken()) {
            return true;
        } else {
            this.authService.redirectUrl = url;
            this.rt.navigate(['login'], { queryParams: { redirectUrl: url } });
            return false;
        }
    }
}
