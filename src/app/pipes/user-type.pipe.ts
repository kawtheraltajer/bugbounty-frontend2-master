import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Pipe({
  name: 'userType',
  pure: false,
})
export class UserTypePipe implements PipeTransform {

  constructor(private auth: AuthService) { }

  transform(value: string[]): boolean {
    if (value) {
      let type: 'client' | 'employee';
      this.auth.userJWT?.value?.clientID ? type = 'client' : null;
      this.auth.userJWT?.value?.employeeID ? type = 'employee' : null;
      return value.includes(type);
    } else {
      return true;
    }
  }

}
