import { AuthzService } from '../services/authz.service';
import { AuthService } from './auth.service';
export function appInitializer(authService: AuthService, authz: AuthzService) {
    return async () => {
        console.log('App INIT');
        return authService.refreshToken().then(x => {
            if (x) {
                authz.calculatePermissions(authService.getJWTPayload().permissions);
            }
            return true
        });
    }
}

