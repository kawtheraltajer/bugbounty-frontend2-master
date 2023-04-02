import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(private authz: AuthzService, private app: AppService, private rt: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let roles = route.data.roles as Array<string>;
        let isAuthz = false;
        let routeAuthz = {};
        roles.forEach(rl => {
            let sp = rl.split(':');
            routeAuthz[sp[0]] = sp[1];
            if (this.authz.userAuthz[sp[0]]) {
                isAuthz = true;
            }
        });

        if (isAuthz) {
            return true;
        } else {
            this.rt.navigateByUrl('/dashboard')
            this.app.presentAlert('Sorry!', "You're Not Authorized to navigate!", 'errorAlert');
            return false;
        }

    }
}
